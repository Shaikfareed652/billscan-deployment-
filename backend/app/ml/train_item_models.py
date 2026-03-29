import sys
sys.path.insert(0, '/workspaces/billscan-deployment-/backend')
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

df = pd.read_csv(Path(__file__).parent / "item_training_data.csv")
FEATURES = ["price_ratio","above_ceiling","below_ceiling",
            "normalized_price","known_item","qty_flag",
            "price_bucket","round_flag"]
X = df[FEATURES].values
y = df["label"].values
print(f"Dataset: {len(X)} | Fraud: {y.sum()} | Normal: {(y==0).sum()}")

X_train,X_test,y_train,y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

print("\n🌲 Training Random Forest...")
rf = RandomForestClassifier(n_estimators=200, max_depth=10,
     class_weight="balanced", random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
print(f"✅ RF: {accuracy_score(y_test,rf.predict(X_test))*100:.1f}%")
print(classification_report(y_test,rf.predict(X_test),target_names=["Normal","Fraud"]))

print("\n⚡ Training XGBoost...")
xgb = XGBClassifier(n_estimators=300, max_depth=6, learning_rate=0.05,
      scale_pos_weight=1.5, eval_metric="logloss", random_state=42)
xgb.fit(X_train, y_train, eval_set=[(X_test,y_test)], verbose=100)
print(f"✅ XGB: {accuracy_score(y_test,xgb.predict(X_test))*100:.1f}%")
print(classification_report(y_test,xgb.predict(X_test),target_names=["Normal","Fraud"]))

# Test real medicines
print("\n🧪 Real Medicine Tests:")
from app.ml.item_features import extract_item_features
tests = [
    ("paracetamol",   5.0,  10, "ceil=₹1.5 → FRAUD"),
    ("paracetamol",   1.5,  10, "ceil=₹1.5 → NORMAL"),
    ("amoxicillin",   150,  6,  "ceil=₹8   → FRAUD"),
    ("acetazolamide", 50,   5,  "ceil=₹4   → FRAUD"),
]
for name,price,qty,desc in tests:
    X_t   = np.array(extract_item_features(name,price,qty)).reshape(1,-1)
    rf_p  = float(rf.predict_proba(X_t)[0][1])
    xgb_p = float(xgb.predict_proba(X_t)[0][1])
    final = (rf_p*0.35)+(xgb_p*0.65)
    print(f"  {name:<20} ₹{price:<6} {final*100:.0f}% {'🔴FRAUD' if final>0.5 else '🟢NORMAL'} | {desc}")

base = Path(__file__).parent
joblib.dump(rf,  base/"item_rf_model.joblib")
joblib.dump(xgb, base/"item_xgb_model.joblib")
print("\n✅ Models saved!")
