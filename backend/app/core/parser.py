import re
from typing import List, Dict

SKIP_KEYWORDS = [
    'description','unit price','amount','subtotal','sub total','gst','cgst',
    'sgst','total','grand total','amount due','amount payable','thank','please',
    'hospital','clinic','phone','email','date','invoice','receipt','bill no',
    'bill date','patient','admission','discharge','doctor','diagnosis','gstin',
    'pan','qty','inpatient','outpatient','apollo','lane','road','street',
    'chennai','mumbai','delhi','bangalore','hyderabad','services','statement',
    'ward','4mg','40mg','500mg','10mg','20mg','25mg','50mg','s0omg',
]

def _clean_ocr_number(text: str):
    """
    Fix OCR misreads:
    - ₹ symbol read as '7' or 'r' or 'R'
    - ₹150  → OCR → '7150'  → fix → 150
    - ₹500  → OCR → 'r500'  → fix → 500
    - <800  → OCR artifact  → fix → 800
    - 72,500→ OCR → '72,500'→ fix → 2500
    """
    t = text.strip()

    # Remove leading OCR artifacts: <, >, s, r, R
    t = re.sub(r'^[<>sS]+', '', t)

    # Remove ₹ symbol
    t = re.sub(r'[₹]', '', t)

    # Remove commas and spaces
    t = t.replace(',', '').replace(' ', '')

    # Key fix: if starts with 7 followed by digits,
    # and removing the 7 gives a more reasonable number → remove it
    # e.g. '7150' → '150', '7500' → '500', '75000' → '5000'
    # But NOT '7' alone, or '70', '700' (valid numbers)
    if re.match(r'^7\d+$', t):
        without7 = t[1:]  # remove leading 7
        # Only remove if result is still a valid number
        # and the leading 7 was likely ₹ misread
        try:
            float(without7)
            float(t)
            # Heuristic: if removing 7 gives number < original/5
            # it's likely a misread ₹
            if float(without7) < float(t) / 5:
                t = without7
        except:
            pass

    # Also handle 'r' prefix: r500 → 500
    if re.match(r'^r\d', t, re.IGNORECASE):
        t = t[1:]

    try:
        v = float(t)
        return v if v > 0 else None
    except:
        return None

def _is_small_qty(v: float) -> bool:
    return v == int(v) and 1 <= v <= 99

def _should_skip(line: str) -> bool:
    low = line.lower().strip()
    if len(low) < 2:
        return True
    if re.search(r'\b\d{6}\b', line):
        return True
    if re.match(r'^[A-Za-z]{1,5}[-/]\d{4}', line):
        return True
    for kw in SKIP_KEYWORDS:
        if kw in low:
            return True
    return False

def parse_rows(ocr_lines: List[str]) -> List[Dict]:
    lines = [l.strip() for l in ocr_lines if l.strip()]
    items = []
    seen  = set()
    i     = 0

    while i < len(lines):
        line = lines[i]
        i   += 1

        if not re.search(r'[A-Za-z]{2,}', line):
            continue
        if _should_skip(line):
            continue

        # Skip lines that start with < (OCR artifact names)
        if line.strip().startswith('<'):
            continue

        name = line.strip().rstrip(':-').strip()
        if len(name) < 3:
            continue

        # Collect next number lines
        nums = []
        j    = i
        while j < len(lines) and len(nums) < 4:
            peek = lines[j]
            v    = _clean_ocr_number(peek)
            if v is not None:
                nums.append(v)
                j += 1
            elif re.search(r'[A-Za-z]{2,}', peek):
                break
            else:
                j += 1

        if not nums:
            continue

        qty        = None
        unit_price = None
        total      = None

        if len(nums) == 1:
            unit_price = nums[0]
            total      = nums[0]

        elif len(nums) == 2:
            unit_price = nums[0]
            total      = nums[1]

        elif len(nums) >= 3:
            possible_qty   = nums[0]
            possible_unit  = nums[1]
            possible_total = nums[2]

            if (_is_small_qty(possible_qty) and
                abs(possible_qty * possible_unit - possible_total) < possible_total * 0.05):
                qty        = int(possible_qty)
                unit_price = possible_unit
                total      = possible_total
            else:
                unit_price = nums[-2]
                total      = nums[-1]

        if not total or total <= 0:
            continue

        i = j

        key = name.lower()
        if key in seen:
            continue
        seen.add(key)

        entry = {
            "name":        name,
            "amount":      total,
            "bill_amount": unit_price if unit_price else total,
            "unit_price":  unit_price if unit_price else total,
        }
        if qty:
            entry["quantity"] = qty

        items.append(entry)

    return items

def parse_bill(ocr_lines):
    return parse_rows(ocr_lines)
