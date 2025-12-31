from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    df = pd.DataFrame(items)
    if df.empty:
        return {"anomaly_score": 0.0, "overcharged_items": [], "summary_text": "No items found"}

    # Ensure standard_price column exists
    if "standard_price" not in df.columns:
        df["standard_price"] = 0.0

    df["ratio"] = df.apply(lambda r: (r["cost"] / r["standard_price"])
                             if r["standard_price"] and r["standard_price"] > 0 else 1.0, axis=1)

    # features for model
    X = df[["cost", "ratio"]].fillna(0).values

    # Use IsolationForest to score anomalies
    try:
        iso = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
        iso.fit(X)
        preds = iso.predict(X)  # -1 anomaly, 1 normal
        scores = iso.decision_function(X)
    except Exception:
        # fallback: simple heuristic
        preds = np.array([1 if r["cost"] <= max(1.0, r.get("standard_price", 0.0) * 2) else -1 for _, r in df.iterrows()])
        scores = np.array([1.0 if p == 1 else -1.0 for p in preds])

    df["is_anomaly"] = (preds == -1)
    df["score"] = scores

    anomaly_score = float((-scores).mean()) if len(scores) else 0.0

    overcharged = []
    for _, row in df.iterrows():
        sp = row.get("standard_price") or 0.0
        if sp and row["cost"] > sp * 1.5:
            overcharged.append({"name": row.get("name"), "cost": row.get("cost"), "standard_price": sp})
        elif row.get("is_anomaly"):
            overcharged.append({"name": row.get("name"), "cost": row.get("cost"), "standard_price": sp})

    summary_text = f"Processed {len(df)} items, found {len(overcharged)} potentially overcharged items."

    return {
        "anomaly_score": anomaly_score,
        "overcharged_items": overcharged,
        "summary_text": summary_text,
        "items": df.to_dict(orient="records"),
    }


def analyze_bill(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compatibility wrapper: analyze_bill -> detect_anomalies"""
    return detect_anomalies(items)
