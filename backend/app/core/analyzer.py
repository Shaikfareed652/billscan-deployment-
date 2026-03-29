import json
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any

_REF_JSON = []
_REF_CSV  = None

SKIP_ITEMS = [
    "nursing", "nurse", "doctor visit", "physician",
    "surgeon fee", "anaesthesia", "anesthesia",
    "professional fee", "visiting", "attendant",
    "service charge", "administrative", "registration",
    "admission fee", "room charges", "room charge",
    "ward charges", "bed charges", "accommodation",
]

def _load():
    global _REF_JSON, _REF_CSV

    # Load nppa_data.json
    if not _REF_JSON:
        for p in [
            Path(__file__).resolve().parents[2] / "nppa_data.json",
            Path(__file__).resolve().parents[1] / "nppa_data.json",
        ]:
            if p.exists():
                with open(p) as f:
                    _REF_JSON = json.load(f)
                print(f"[ANALYZER] JSON: {len(_REF_JSON)} items from {p.name}")
                break

    # Load nppa_clean.csv
    if _REF_CSV is None:
        for p in [
            Path(__file__).resolve().parents[2] / "app/ml/nppa_clean.csv",
            Path(__file__).resolve().parents[1] / "ml/nppa_clean.csv",
        ]:
            if p.exists():
                _REF_CSV = pd.read_csv(p)
                print(f"[ANALYZER] CSV: {len(_REF_CSV)} medicines from {p.name}")
                break
        if _REF_CSV is None:
            _REF_CSV = pd.DataFrame()

def _should_skip(name: str) -> bool:
    n = name.lower()
    return any(s in n for s in SKIP_ITEMS)

def _find_price(name: str) -> float:
    _load()
    n = name.lower().strip()

    # Search JSON first
    for item in _REF_JSON:
        if item.get("name", "").lower() == n:
            return float(item.get("price", 0))
    for item in _REF_JSON:
        r = item.get("name", "").lower()
        if r and (r in n or n in r):
            return float(item.get("price", 0))

    # Search CSV
    if not _REF_CSV.empty and "medicine" in _REF_CSV.columns:
        for _, row in _REF_CSV.iterrows():
            ref = str(row["medicine"]).lower().strip()
            if ref == n or ref in n or n in ref:
                return float(row["ceil_price"])

    return 0.0

def analyze_items(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    _load()
    result        = []
    overpriced    = 0
    total_billed  = 0
    total_savings = 0

    for item in items:
        name        = item.get("name", "")
        bill_amt    = float(item.get("amount", 0))
        unit_price  = float(item.get("unit_price", 0))
        compare_amt = unit_price if unit_price > 0 else bill_amt
        total_billed += bill_amt

        if _should_skip(name):
            continue

        ref_price = _find_price(name)

        if ref_price > 0 and compare_amt > ref_price * 1.3:
            verdict       = "Overpriced"
            diff          = compare_amt - ref_price
            overpriced   += 1
            total_savings += diff
        elif ref_price > 0:
            verdict = "Normal"
            diff    = compare_amt - ref_price
        else:
            verdict = "Unknown"
            diff    = 0

        result.append({
            "name":            name,
            "bill_amount":     compare_amt,
            "reference_price": ref_price if ref_price > 0 else None,
            "difference":      round(diff, 2),
            "verdict":         verdict,
        })

    total   = len(result)
    pct     = overpriced / total if total > 0 else 0
    overall = "RED" if pct >= 0.4 else "YELLOW" if pct > 0 else "GREEN"

    return {
        "items": result,
        "summary": {
            "total_items":      total,
            "overpriced_count": overpriced,
            "total_billed":     total_billed,
            "total_savings":    round(total_savings, 2),
            "overall_verdict":  overall,
        }
    }
