import json
import re
from typing import List, Dict, Any
from pathlib import Path


def load_nppa(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _find_standard_price(name: str, nppa: List[Dict[str, Any]]) -> float:
    lname = name.upper()
    for entry in nppa:
        if entry.get("name") and entry["name"] in lname:
            return float(entry.get("price", 0.0))
    # fuzzy fallback: check if any nppa name is substring
    for entry in nppa:
        if entry.get("name") and entry["name"] in lname:
            return float(entry.get("price", 0.0))
    return 0.0


def parse_text_into_items(text: str, nppa: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Parse OCR text into list of items with name, qty, cost, category, standard_price

    This is heuristic-based and best-effort.
    """
    items = []
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    price_re = re.compile(r"(\d+[,.]?\d{0,2})$")

    for line in lines:
        # Try to extract price at end
        m = price_re.search(line)
        if not m:
            continue
        price_raw = m.group(1).replace(',', '.')
        try:
            price = float(price_raw)
        except ValueError:
            continue

        # remove price from line to get name/qty
        lead = line[:m.start()].strip()

        qty = 1
        # If trailing token before price is an integer, treat as qty
        tokens = lead.split()
        if tokens and tokens[-1].isdigit():
            qty = int(tokens[-1])
            name = " ".join(tokens[:-1])
        else:
            name = lead

        if not name:
            name = "UNKNOWN"

        standard_price = _find_standard_price(name, nppa) if nppa else 0.0
        category = None
        for entry in nppa:
            if entry.get("name") and entry["name"] in name.upper():
                category = entry.get("category")
                break

        items.append({
            "name": name.strip(),
            "qty": qty,
            "cost": price,
            "category": category or "Unknown",
            "standard_price": standard_price,
        })

    return items


def parse_bill(text: str) -> List[Dict[str, Any]]:
    """Public helper matching expected API: parse_bill(text) -> list

    Attempts to load `nppa_data.json` from the backend package directory if present
    and delegates to the existing `parse_text_into_items` logic.
    """
    try:
        base = Path(__file__).resolve().parent
        nppa_path = base / "nppa_data.json"
        if nppa_path.exists():
            nppa = load_nppa(str(nppa_path))
        else:
            nppa = []
    except Exception:
        nppa = []

    return parse_text_into_items(text, nppa)
