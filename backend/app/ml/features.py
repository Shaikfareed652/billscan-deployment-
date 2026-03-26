from typing import List, Dict

def extract_features(items: List[Dict], total_amount: float, days: int = 1) -> List[float]:
    if not items:
        return [0.0] * 9

    ratios = []
    for item in items:
        ref = item.get("reference_price", 0)
        billed = item.get("bill_amount", 0)
        if ref > 0:
            ratios.append(billed / ref)

    avg_ratio = sum(ratios) / len(ratios) if ratios else 1.0
    max_ratio = max(ratios) if ratios else 1.0
    overpriced = sum(1 for i in items if i.get("verdict") == "Overpriced")
    overpriced_pct = overpriced / len(items) if items else 0.0
    total_items = len(items)
    names = [i.get("name", "").lower() for i in items]
    has_duplicates = 1.0 if len(names) != len(set(names)) else 0.0
    round_count = sum(1 for i in items if i.get("bill_amount", 0) % 1000 == 0 and i.get("bill_amount", 0) > 0)
    round_ratio = round_count / len(items) if items else 0.0
    total = total_amount if total_amount > 0 else sum(i.get("bill_amount", 0) for i in items)
    days_admitted = max(days, 1)
    cost_per_day = total / days_admitted

    return [avg_ratio, max_ratio, overpriced_pct, float(total_items),
            has_duplicates, round_ratio, total, float(days_admitted), cost_per_day]
