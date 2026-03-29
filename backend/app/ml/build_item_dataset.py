import sys
sys.path.insert(0, '/workspaces/billscan-deployment-/backend')
import pandas as pd
import numpy as np
from pathlib import Path
from app.ml.item_features import extract_item_features

print("Loading NPPA CSV...")
df = pd.read_csv(Path(__file__).parent / "nppa_clean.csv")
print(f"Loaded {len(df)} medicines")

rows = []
np.random.seed(42)

for _, med in df.iterrows():
    name  = str(med["medicine"])
    ceil  = float(med["ceil_price"])
    if ceil <= 0 or pd.isna(ceil):
        continue
    # Normal samples
    for _ in range(3):
        billed = ceil * np.random.uniform(0.7, 1.3)
        qty    = np.random.randint(1, 5)
        feats  = extract_item_features(name, billed, qty)
        rows.append(feats + [0])
    # Fraud samples
    for _ in range(2):
        billed = ceil * np.random.uniform(2.0, 8.0)
        qty    = np.random.randint(1, 10)
        feats  = extract_item_features(name, billed, qty)
        rows.append(feats + [1])

cols = ["price_ratio","above_ceiling","below_ceiling",
        "normalized_price","known_item","qty_flag",
        "price_bucket","round_flag","label"]

dataset = pd.DataFrame(rows, columns=cols)
dataset = dataset.replace([np.inf, -np.inf], np.nan).dropna()

print(f"Total samples: {len(dataset)}")
print(f"Normal: {(dataset.label==0).sum()}")
print(f"Fraud:  {(dataset.label==1).sum()}")

dataset.to_csv(Path(__file__).parent / "item_training_data.csv", index=False)
print("✅ Saved item_training_data.csv")
