import joblib
import numpy as np
from pathlib import Path
from app.ml.features import extract_features
from app.ml.item_features import extract_item_features

_rf_model       = None
_xgb_model      = None
_item_rf_model  = None
_item_xgb_model = None

def _load_models():
    global _rf_model, _xgb_model, _item_rf_model, _item_xgb_model
    base = Path(__file__).parent
    models = {
        "_rf_model":       "fraud_model.joblib",
        "_xgb_model":      "xgb_model.joblib",
        "_item_rf_model":  "item_rf_model.joblib",
        "_item_xgb_model": "item_xgb_model.joblib",
    }
    for var, fname in models.items():
        p = base / fname
        if p.exists() and globals()[var] is None:
            globals()[var] = joblib.load(p)
            print(f"[ML] ✅ Loaded {fname}")

def predict_fraud(items: list, total_amount: float, days: int = 1) -> dict:
    _load_models()

    # ── Item-level predictions ─────────────────────────
    item_scores = []
    for item in items:
        name       = item.get("name", "")
        unit_price = float(item.get("bill_amount", item.get("unit_price", 0)))
        qty        = float(item.get("quantity", 1))
        verdict    = item.get("verdict", "")
        ref_price  = float(item.get("reference_price") or 0)

        if verdict == "Excluded" or unit_price <= 0:
            continue

        feats = extract_item_features(name, unit_price, qty)
        X     = np.array(feats).reshape(1, -1)

        rf_p  = float(_item_rf_model.predict_proba(X)[0][1])  if _item_rf_model  else 0.5
        xgb_p = float(_item_xgb_model.predict_proba(X)[0][1]) if _item_xgb_model else 0.5

        # Ensemble per item
        item_prob = (rf_p * 0.35) + (xgb_p * 0.65)

        # ✅ Key fix: if reference price exists and item is normal → cap fraud score
        if ref_price > 0 and unit_price <= ref_price * 1.3:
            item_prob = min(item_prob, 0.35)  # cap at LOW if price is fine

        item_scores.append(item_prob)

    item_score = float(np.mean(item_scores)) if item_scores else 0.5

    # ── Bill-level prediction ──────────────────────────
    features  = extract_features(items, total_amount, days)
    X_bill    = np.array(features).reshape(1, -1)
    rf_bill   = float(_rf_model.predict_proba(X_bill)[0][1])  if _rf_model  else 0.5
    xgb_bill  = float(_xgb_model.predict_proba(X_bill)[0][1]) if _xgb_model else 0.5
    bill_score = (rf_bill * 0.35) + (xgb_bill * 0.65)

    # ── Combine: item-level 70% + bill-level 30% ──────
    final_prob = (item_score * 0.70) + (bill_score * 0.30)

    # Risk
    if final_prob >= 0.65:
        risk, emoji = "HIGH",   "🔴"
    elif final_prob >= 0.35:
        risk, emoji = "MEDIUM", "🟡"
    else:
        risk, emoji = "LOW",    "🟢"

    # Explanations
    explanations = []
    if features[0] > 2.0:
        explanations.append(f"Items avg {features[0]:.1f}x above reference price")
    if features[1] > 4.0:
        explanations.append(f"Worst item is {features[1]:.1f}x overpriced")
    if features[2] > 0.5:
        explanations.append(f"{int(features[2]*100)}% of items are overpriced")
    if features[4]:
        explanations.append("Duplicate charges detected")
    if not explanations:
        explanations.append("Bill appears within normal range")

    return {
        "fraud_probability":         round(final_prob, 3),
        "fraud_probability_percent": f"{final_prob * 100:.1f}%",
        "fraud_risk":                risk,
        "risk_emoji":                emoji,
        "explanation":               ". ".join(explanations),
        "model_scores": {
            "item_level": f"{item_score*100:.1f}%",
            "bill_level": f"{bill_score*100:.1f}%",
            "final":      f"{final_prob*100:.1f}%",
        }
    }
