"""
OCR Module for Bill Analysis

This module uses EasyOCR to extract text from images and PDFs.

What is OCR?
- OCR = Optical Character Recognition
- It reads text from images and converts it to machine-readable format
- Used here to extract bill text from photos/scans

Why OCR may be imperfect:
- Image quality affects accuracy (blurry/tilted images = lower accuracy)
- Different fonts and handwriting styles are harder to recognize
- Images with overlays or watermarks may confuse the model
- Numbers and special characters can sometimes be misread

Why we allow errors here:
- We can't guarantee 100% accuracy from images
- The parsing and analyzer modules will catch obvious issues
- Manual review is always recommended for important decisions
"""

import os
from typing import List
from pathlib import Path


def extract_text_from_image(file_path: str) -> List[str]:
    """
    Extract text from an image using EasyOCR.
    
    Args:
        file_path: Path to image file (.jpg, .png, etc.)
    
    Returns:
        List of text lines extracted from the image
    
    Raises:
        RuntimeError: If extraction fails
    """
    try:
        import easyocr
    except ImportError:
        raise RuntimeError(
            "EasyOCR not installed. Install with: pip install easyocr"
        )
    
    if not os.path.exists(file_path):
        raise RuntimeError(f"File not found: {file_path}")
    
    try:
        # Initialize reader (downloads model on first use)
        reader = easyocr.Reader(['en'])
        
        # Read text from image
        results = reader.readtext(file_path)
        
        # Extract text lines from results
        # results format: [(bbox, text, confidence), ...]
        lines = [text for (_, text, _) in results]
        
        if not lines:
            raise RuntimeError("No text found in image. Please check image quality.")
        
        return lines
    
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {str(e)}")


def extract_text_from_pdf(file_path: str) -> List[str]:
    """
    Extract text from a PDF file.
    
    This is a placeholder. For production, use pdf2image + OCR or PyPDF2.
    
    Args:
        file_path: Path to PDF file
    
    Returns:
        List of text lines extracted from the PDF
    
    Raises:
        RuntimeError: If extraction fails
    """
    try:
        from pdf2image import convert_from_path
        import easyocr
    except ImportError:
        raise RuntimeError(
            "pdf2image or EasyOCR not installed. "
            "Install with: pip install pdf2image easyocr"
        )
    
    if not os.path.exists(file_path):
        raise RuntimeError(f"File not found: {file_path}")
    
    try:
        # Convert PDF pages to images
        pages = convert_from_path(file_path, first_page=1, last_page=1)
        
        if not pages:
            raise RuntimeError("Could not convert PDF to images")
        
        # Save first page to temporary file
        temp_image_path = "/tmp/temp_ocr_image.png"
        pages[0].save(temp_image_path, "PNG")
        
        # Extract text using EasyOCR
        lines = extract_text_from_image(temp_image_path)
        
        # Clean up
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)
        
        return lines
    
    except Exception as e:
        raise RuntimeError(f"PDF OCR extraction failed: {str(e)}")


def extract_text(file_path: str) -> List[str]:
    """
    Main entry point: Extract text from any supported file type.
    
    Args:
        file_path: Path to image or PDF file
    
    Returns:
        List of text lines
    
    Raises:
        RuntimeError: If file type not supported or extraction fails
    """
    if not os.path.exists(file_path):
        raise RuntimeError(f"File not found: {file_path}")
    
    file_lower = file_path.lower()
    
    # Determine file type and call appropriate function
    if file_lower.endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff')):
        return extract_text_from_image(file_path)
    elif file_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    else:
        raise RuntimeError(
            f"Unsupported file type: {Path(file_path).suffix}. "
            "Supported: PNG, JPG, JPEG, GIF, BMP, TIFF, PDF"
        )
