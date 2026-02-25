#!/usr/bin/env python
"""Debug script to test OCR extraction and parsing."""

import sys
from pathlib import Path

# Ensure parent folder is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.app.core import ocr, parser

# Test OCR
bill_path = "backend/test_bill.jpg"
print("=" * 60)
print(f"Testing OCR on: {bill_path}")
print("=" * 60)

try:
    lines = ocr.extract_text(bill_path)
    print(f"\nExtracted {len(lines)} lines:")
    print("-" * 60)
    for i, line in enumerate(lines[:30]):  # Show first 30 lines
        print(f"{i+1:2d}: {line}")
    if len(lines) > 30:
        print(f"... and {len(lines) - 30} more lines")
    
    print("\n" + "=" * 60)
    print("Testing Parser")
    print("=" * 60)
    
    items = parser.parse_rows(lines)
    print(f"\nParsed {len(items)} items:")
    print("-" * 60)
    for item in items:
        print(f"Name: '{item['name']}' | Amount: {item['amount']}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
