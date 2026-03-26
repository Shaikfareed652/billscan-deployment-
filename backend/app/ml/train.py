import sys
sys.path.insert(0, '/workspaces/billscan')

import joblib
import numpy as np
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from app.ml.training_data import TRAINING_BILLS

X = np.array([b[0] for b in TRAINING_BILLS])
y = np.array([b[1] for b in TRAINING_BILLS])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.1f}%")
print(classification_report(y_test, y_pred, target_names=["Legitimate", "Fraudulent"]))

model_path = Path(__file__).parent / "fraud_model.joblib"
joblib.dump(model, model_path)
print(f"✅ Model saved: {model_path}")
