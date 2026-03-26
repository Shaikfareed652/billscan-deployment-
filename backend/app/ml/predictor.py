import joblib
import numpy as np
from pathlib import Path
from backend.app.ml.features import extract_features

_model = None

def _load_model():
    global _model
    if _model is None:
        path = Path(__file__).parent / "fraud_model.joblib"
        if not path.exists():
            return None
        _model = joblib.load(path)
    return _model

def predict_fraud(items: list, total_amount: float, days: int = 1) -> dict:
    model = _load_model()
    if not model:
        return {"fraud_risk": "UNKNOWN", "fraud_probability_percent": "N/A",
                "explanation": "ML model not trained yet"}

    features = extract_features(items, total_amount, days)
    proba = model.predict_proba(np.array(features).reshape(1, -1))[0]
    fraud_prob = float(proba[1])

    if fraud_prob >= 0.7:
        risk, emoji = "HIGH", "🔴"
    elif fraud_prob >= 0.4:
        risk, emoji = "MEDIUM", "🟡"
    else:
        risk, emoji = "LOW", "🟢"

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
        "fraud_probability": round(fraud_prob, 3),
        "fraud_probability_percent": f"{fraud_prob * 100:.1f}%",
        "fraud_risk": risk,
        "risk_emoji": emoji,
        "explanation": ". ".join(explanations),
    }
