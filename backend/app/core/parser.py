"""
Parser Module for Bill Analysis

This module cleans and parses raw OCR text into structured bill items.

Logic:
1. Split OCR text into lines
2. Remove headers, symbols, and junk text
3. Keep lines that contain numbers (amounts)
4. Extract item name and amount from each line
5. Return list of structured items

Why this approach:
- Medical bills have consistent structure (item name + amount)
- Numbers indicate actual charges
- Removing junk text prevents false matches
- Simple regex parsing is fast and readable
"""

import re
import json
from typing import List, Dict, Any
from pathlib import Path


def load_price_reference() -> List[Dict[str, Any]]:
    """
    Load price reference data from price_reference.json
    
    Returns:
        List of price reference items
    """
    ref_file = Path(__file__).resolve().parent / "price_reference.json"
    
    try:
        with open(ref_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get("price_reference", [])
    except Exception as e:
        # If file doesn't exist or is invalid, return empty list
        # Analyzer will handle missing reference prices
        print(f"Warning: Could not load price reference: {e}")
        return []


def clean_text_line(line: str) -> str:
    """
    Clean a single text line by removing symbols and extra whitespace.
    
    Args:
        line: Raw text line from OCR
    
    Returns:
        Cleaned text line
    """
    # Remove extra whitespace
    line = " ".join(line.split())
    
    # Remove common OCR artifacts and symbols
    line = re.sub(r'[®™©]', '', line)
    line = re.sub(r'\s+', ' ', line)
    
    return line.strip()


def extract_amount(text: str) -> float:
    """
    Extract numeric amount from text.
    
    Looks for patterns like:
    - 1200
    - 1,200
    - 1,200.50
    - Rs. 1200
    
    Args:
        text: Text containing a number
    
    Returns:
        Extracted number as float, or 0.0 if not found
    """
    # Remove currency symbols and text before the number
    text = re.sub(r'[Rs.₹$]+', '', text)
    
    # Find last number pattern in the line (usually the amount)
    # Matches: 1200, 1,200, 1,200.50, 1.200,50
    matches = re.findall(r'\d+[,.]?\d*(?:[,.]?\d{1,2})?', text)
    
    if matches:
        # Take the last number (usually the amount)
        amount_str = matches[-1].replace(',', '')
        try:
            return float(amount_str)
        except ValueError:
            return 0.0
    
    return 0.0


def parse_bill(ocr_lines: List[str]) -> List[Dict[str, Any]]:
    """
    Parse OCR text lines into structured bill items.
    
    This function:
    1. Cleans each line
    2. Filters out lines without numbers (junk text)
    3. Extracts item name and amount
    4. Matches against reference prices
    5. Returns structured data
    
    Args:
        ocr_lines: List of raw text lines from OCR
    
    Returns:
        List of parsed items with structure:
        {
            "item": "CBC Test",
            "amount": 1200,
            "expected_price": 800,
            "confidence": "medium"
        }
    """
    if not ocr_lines:
        return []
    
    # Load price reference for comparison
    reference_prices = load_price_reference()
    
    parsed_items = []
    
    for line in ocr_lines:
        # Clean the line
        cleaned = clean_text_line(line)
        
        if not cleaned:
            continue
        
        # Skip lines that are too short (likely headers/junk)
        if len(cleaned) < 3:
            continue
        
        # Check if line contains a number
        if not re.search(r'\d', cleaned):
            continue
        
        # Extract amount from the end of the line
        amount = extract_amount(cleaned)
        
        if amount <= 0:
            continue
        
        # Extract item name (everything before the amount)
        item_name = re.sub(r'\d+[,.]?\d*(?:[,.]?\d{1,2})?', '', cleaned).strip()
        item_name = re.sub(r'[Rs.₹$]+', '', item_name).strip()
        
        # Skip if no item name
        if not item_name or len(item_name) < 2:
            continue
        
        # Find matching reference price
        expected_price = find_reference_price(item_name, reference_prices)
        
        # Determine confidence level
        confidence = determine_confidence(amount, expected_price)
        
        parsed_items.append({
            "item": item_name,
            "amount": amount,
            "expected_price": expected_price,
            "confidence": confidence
        })
    
    return parsed_items


def find_reference_price(item_name: str, reference_prices: List[Dict[str, Any]]) -> float:
    """
    Find reference price for an item using keyword matching.
    
    Strategy:
    1. Convert both to lowercase for case-insensitive matching
    2. Check if any reference item is contained in the bill item
    3. Check partial word matches
    4. Return the price if found
    
    Args:
        item_name: Name of item from bill
        reference_prices: List of reference items with prices
    
    Returns:
        Reference price if found, otherwise 0.0
    """
    item_lower = item_name.lower()
    
    # Exact substring match (best match)
    for ref in reference_prices:
        ref_item = ref.get("item", "").lower()
        if ref_item and ref_item in item_lower:
            return float(ref.get("price", 0.0))
    
    # Partial word match (if key words match)
    for ref in reference_prices:
        ref_item = ref.get("item", "").lower()
        ref_words = set(ref_item.split())
        item_words = set(item_lower.split())
        
        # If at least 1 word matches, consider it a match
        if ref_words & item_words:  # Set intersection
            return float(ref.get("price", 0.0))
    
    return 0.0


def determine_confidence(billed_amount: float, expected_price: float) -> str:
    """
    Determine confidence level of price analysis.
    
    Logic:
    - HIGH: No reference price found (can't verify)
    - MEDIUM: Billed amount is 20-50% higher than expected
    - LOW: Billed amount is normal or only slightly higher
    
    Args:
        billed_amount: Amount charged on the bill
        expected_price: Expected/reference price
    
    Returns:
        Confidence level: "HIGH", "MEDIUM", or "LOW"
    """
    if expected_price <= 0:
        # Can't compare without reference
        return "LOW"
    
    difference_percent = ((billed_amount - expected_price) / expected_price) * 100
    
    if difference_percent > 50:
        return "HIGH"
    elif difference_percent > 20:
        return "MEDIUM"
    else:
        return "LOW"


def parse_rows(ocr_lines):
    """
    Wrapper that calls the main parse function and returns
    list of {name, amount} dicts compatible with analyzer.
    """
    items = []
    seen = set()

    import re

    SKIP = [
        'description','quantity','unit price','amount','subtotal','sub total',
        'gst','cgst','sgst','total','grand total','amount due','amount payable',
        'thank','please','hospital','clinic','phone','email','date','invoice',
        'receipt','bill no','bill date','patient','admission','discharge',
        'doctor','diagnosis','gstin','pan','qty','unit','price','inpatient',
        'outpatient','apollo','lane','road','street','chennai','mumbai',
        'delhi','bangalore','hyderabad','services','statement','ward',
    ]

    def is_amount(text):
        c = text.strip()
        c = re.sub(r'^[₹rR]', '', c)
        c = re.sub(r'^Rs\.?\s*', '', c)
        c = c.replace(',','').replace(' ','')
        if not re.match(r'^\d+(\.\d{1,2})?$', c):
            return False
        try:
            return float(c) > 0
        except:
            return False

    def parse_amt(text):
        c = re.sub(r'^[₹7rR]', '', text.strip())
        c = re.sub(r'^Rs\.?\s*', '', c)
        c = c.replace(',','').replace(' ','')
        try:
            return float(c)
        except:
            return 0.0

    def should_skip(line):
        lower = line.lower().strip()
        if len(lower) < 2:
            return True
        if re.search(r'\b\d{6}\b', line):
            return True
        if re.match(r'^[A-Za-z]{1,5}[-/]\d{4}', line):
            return True
        if re.match(r'^[a-z]\d+[a-z]*$', lower) and len(lower) < 6:
            return True
        for kw in SKIP:
            if kw in lower:
                return True
        return False

    i = 0
    while i < len(ocr_lines):
        line = ocr_lines[i].strip()
        i += 1
        if not line or is_amount(line) or should_skip(line):
            continue
        name = line.rstrip('-: ').strip()
        if len(name) < 3:
            continue
        # collect consecutive amount lines
        amt_lines = []
        while i < len(ocr_lines):
            peek = ocr_lines[i].strip()
            if is_amount(peek):
                amt_lines.append(peek)
                i += 1
            elif re.match(r'^\d+$', peek) and int(peek) <= 99:
                i += 1  # skip quantity
            else:
                break
        if not amt_lines:
            continue
        amount = parse_amt(amt_lines[-1])
        if amount <= 0:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        items.append({"name": name, "amount": amount})

    return items
