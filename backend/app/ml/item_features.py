import pandas as pd
import numpy as np
from pathlib import Path
import re

_NPPA = None

def _load_nppa():
    global _NPPA
    if _NPPA is not None:
        return _NPPA
    p = Path(__file__).parent / "nppa_clean.csv"
    if p.exists():
        _NPPA = pd.read_csv(p)
        print(f"[NPPA] Loaded {len(_NPPA)} medicines")
        return _NPPA
    _NPPA = pd.DataFrame()
    return _NPPA

def _find_ceil_price(name: str) -> float:
    df = _load_nppa()
    if df.empty:
        return 0.0
    n = name.lower().strip()
    n = re.sub(r'\d+\s*(mg|ml|gm|mcg|iu)', '', n).strip()
    for _, row in df.iterrows():
        ref = str(row["medicine"]).lower().strip()
        ref = re.sub(r'\d+\s*(mg|ml|gm|mcg|iu)', '', ref).strip()
        if ref == n or ref in n or n in ref:
            return float(row["ceil_price"])
    return 0.0

def extract_item_features(name: str, unit_price: float, qty: float = 1) -> list:
    ceil = _find_ceil_price(name)
    known = 1.0 if ceil > 0 else 0.0
    if ceil > 0:
        ratio         = unit_price / ceil
        above_ceiling = max(0, (unit_price - ceil) / ceil)
        below_ceiling = max(0, (ceil - unit_price) / ceil)
    else:
        ratio         = 1.0
        above_ceiling = 0.0
        below_ceiling = 0.0
    normalized  = min(unit_price / 10000, 1.0)
    qty_flag    = min(qty / 20, 1.0)
    bucket      = 0 if unit_price < 50 else (1 if unit_price < 500 else (2 if unit_price < 5000 else 3))
    round_flag  = 1.0 if unit_price % 100 == 0 else 0.0
    return [ratio, above_ceiling, below_ceiling, normalized, known, qty_flag, float(bucket), round_flag]
