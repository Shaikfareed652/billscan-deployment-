import io
import os
from typing import Optional

from google.cloud import vision
from PIL import Image


def _ensure_google_credentials():
    # If a custom env var is provided, set GOOGLE_APPLICATION_CREDENTIALS
    gcp_path = os.getenv("GCP_CREDENTIALS_PATH")
    if gcp_path and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = gcp_path


def extract_text(file_path: str) -> str:
    """Extracts text from an image file. If PDF, attempts to convert first page to image.

    Raises RuntimeError on failure.
    """
    _ensure_google_credentials()
    client = vision.ImageAnnotatorClient()

    lower = file_path.lower()
    content = None

    try:
        if lower.endswith(".pdf"):
            # Try to convert first PDF page to image using pdf2image
            try:
                from pdf2image import convert_from_path

                pages = convert_from_path(file_path, first_page=1, last_page=1)
                if not pages:
                    raise RuntimeError("PDF conversion failed")
                buf = io.BytesIO()
                pages[0].save(buf, format="PNG")
                content = buf.getvalue()
            except Exception as e:
                raise RuntimeError(f"PDF processing failed: {e}")
        else:
            with open(file_path, "rb") as f:
                content = f.read()

        if content is None:
            raise RuntimeError("No content to OCR")

        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        if response.error.message:
            raise RuntimeError(response.error.message)

        text = response.full_text_annotation.text if response.full_text_annotation else ""
        if not text:
            # fallback to concatenating text_annotations
            text = "\n".join([a.description for a in response.text_annotations])
        return text
    except Exception as e:
        raise RuntimeError(f"OCR failed: {e}")
