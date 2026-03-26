import json
from pathlib import Path
from typing import List, Dict, Any

_REF = []

def _load():
    global _REF
    if _REF:
        return _REF
    for p in [
        Path(__file__).resolve().parents[2] / "nppa_data.json",
        Path(__file__).resolve().parents[3] / "nppa_data.json",
        Path(__file__).resolve().parents[2] / "price_reference.json",
    ]:
        if p.exists():
            with open(p) as f:
                _REF = json.load(f)
            print(f"[ANALYZER] Loaded {len(_REF)} items from {p.name}")
            return _REF
    print("[ANALYZER] WARNING: No reference price file found")
    return _REF

def _find_price(name: str) -> float:
    refs = _load()
    n = name.lower().strip()
    for item in refs:
        if item.get("name", "").lower() == n:
            return float(item.get("price", 0))
    for item in refs:
        r = item.get("name", "").lower()
        if r in n or n in r:
            return float(item.get("price", 0))
    return 0.0

def analyze_items(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    result = []
    overpriced = 0
    total_billed = 0
    total_savings = 0

    for item in items:
        name = item.get("name", "")
        bill_amt = float(item.get("amount", 0))
        ref_price = _find_price(name)
        total_billed += bill_amt

        if ref_price > 0 and bill_amt > ref_price * 1.3:
            verdict = "Overpriced"
            diff = bill_amt - ref_price
            overpriced += 1
            total_savings += diff
        elif ref_price > 0:
            verdict = "Normal"
            diff = bill_amt - ref_price
        else:
            verdict = "Unknown"
            diff = 0

        result.append({
            "name": name,
            "bill_amount": bill_amt,
            "reference_price": ref_price,
            "difference": diff,
            "verdict": verdict,
        })

    total = len(result)
    pct = overpriced / total if total > 0 else 0
    overall = "RED" if pct >= 0.4 else "YELLOW" if pct > 0 else "GREEN"

    return {
        "items": result,
        "summary": {
            "total_items": total,
            "overpriced_count": overpriced,
            "total_billed": total_billed,
            "total_savings": total_savings,
            "overall_verdict": overall,
        }
    }
