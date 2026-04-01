import easyocr
import os
from pathlib import Path

_reader = None

def get_reader():
    global _reader
    if _reader is None:
        print("[OCR] Loading EasyOCR reader...")
        _reader = easyocr.Reader(['en'], gpu=False)
        print("[OCR] Reader loaded successfully")
    return _reader

def extract_text(image_path: str) -> list:
    try:
        reader = get_reader()
        results = reader.readtext(image_path, detail=0, paragraph=False)
        return [str(r).strip() for r in results if str(r).strip()]
    except Exception as e:
        print(f"[OCR] Error: {e}")
        return []
