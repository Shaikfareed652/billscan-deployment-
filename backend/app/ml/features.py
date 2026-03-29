from typing import List, Dict

def extract_features(items: List[Dict], total_amount: float, days: int = 1) -> List[float]:
    if not items:
        return [0.0] * 9

    # Filter out excluded items
    valid = [i for i in items if i.get("verdict") not in ("Excluded", None)]
    if not valid:
        valid = items

    ratios = []
    for item in valid:
        ref    = item.get("reference_price") or 0
        billed = item.get("bill_amount") or item.get("amount") or 0
        # Convert to float safely
        try:
            ref    = float(ref)
            billed = float(billed)
        except (TypeError, ValueError):
            continue
        if ref > 0 and billed > 0:
            ratios.append(billed / ref)

    avg_ratio    = sum(ratios) / len(ratios) if ratios else 1.0
    max_ratio    = max(ratios) if ratios else 1.0
    overpriced   = sum(1 for i in valid if i.get("verdict") == "Overpriced")
    overpriced_pct = overpriced / len(valid) if valid else 0.0
    total_items  = len(valid)
    names        = [str(i.get("name", "")).lower() for i in valid]
    has_duplicates = 1.0 if len(names) != len(set(names)) else 0.0
    round_count  = sum(
        1 for i in valid
        if float(i.get("bill_amount") or 0) % 100 == 0
        and float(i.get("bill_amount") or 0) > 0
    )
    round_ratio  = round_count / len(valid) if valid else 0.0

    try:
        total = float(total_amount) if total_amount else sum(
            float(i.get("bill_amount") or 0) for i in valid
        )
    except (TypeError, ValueError):
        total = 0.0

    days_admitted = max(int(days) if days else 1, 1)
    cost_per_day  = total / days_admitted

    return [
        float(avg_ratio),
        float(max_ratio),
        float(overpriced_pct),
        float(total_items),
        float(has_duplicates),
        float(round_ratio),
        float(total),
        float(days_admitted),
        float(cost_per_day),
    ]
