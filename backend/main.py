"""
FastAPI Backend for Medical Bill Analysis

This backend provides endpoints for:
1. Uploading medical bills (image or PDF)
2. Extracting text using OCR
3. Parsing and analyzing bills for potential overcharges
4. Returning structured analysis with confidence levels

How FastAPI Works:
- FastAPI is a modern Python web framework built on ASGI (Asynchronous Server Gateway Interface)
- Uses Python type hints for automatic data validation and parsing
- Provides automatic OpenAPI documentation at /docs (Swagger UI) and /redoc
- Fast, production-ready, with built-in support for async/await
- Middleware layers allow cross-cutting concerns (CORS, logging, etc.)

Running the app:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

The --reload flag watches for code changes and restarts the server.
"""

import os
import sys
import shutil
import uuid
import tempfile
from pathlib import Path
from datetime import datetime

# Ensure parent folder is on sys.path so absolute imports work
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import our custom modules
# ✅ CORRECT
from analyzer import analyze_bill
from parser import parse_bill
from ocr import extract_text
from db import save_report
from backend.schemas import (
    UploadResponse,
    BillAnalysisResult,
    ItemAnalysis,
    HealthResponse,
)

from typing import List, Dict, Any

# ============================================================================
# Configuration
# ============================================================================

BASE_DIR = Path(__file__).resolve().parent
UPLOADS = BASE_DIR / "uploads"
UPLOADS.mkdir(exist_ok=True)

# Allowed file extensions for upload
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.pdf'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

# ============================================================================
# Create FastAPI Application
# ============================================================================

# Create the FastAPI application instance.
# FastAPI is an ASGI (Asynchronous Server Gateway Interface) framework.
# Key features:
# - Use Python type hints to validate and parse request data automatically.
# - Define routes with decorators like `@app.get`, `@app.post`, etc.
# - Automatic API documentation available at `/docs` (Swagger UI) and `/redoc`.
# - Designed for high performance and easy dependency injection.
#
# This application will expose endpoints for the bill-scanning service.
app = FastAPI(
    title="Medical Bill Analysis API",
    description="API for analyzing medical bills for potential overcharges",
    version="1.0.0"
)

# ============================================================================
# Middleware
# ============================================================================

# Add CORS (Cross-Origin Resource Sharing) middleware.
# This allows the frontend to make requests from a different domain.
# In production, replace allow_origins=["*"] with specific frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (configure for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Endpoints
# ============================================================================


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Status and message indicating service is running
    
    Useful for:
    - Load balancers to verify service is alive
    - Kubernetes probes for container health
    - Monitoring systems to track uptime
    """
    return {"status": "ok", "message": "Service is running"}


@app.post("/upload-bill", response_model=UploadResponse)
async def upload_bill(file: UploadFile = File(...)):
    """
    Upload a medical bill image or PDF for analysis.
    
    This endpoint:
    1. Validates file type and size
    2. Saves file temporarily to /tmp
    3. Returns file path for analysis
    
    Args:
        file: Image or PDF file (JPG, PNG, PDF, etc.)
    
    Returns:
        UploadResponse with file path and status
    
    Why validation matters:
    - File type validation prevents malicious uploads (e.g., executables)
    - Size validation prevents DoS attacks
    - Only allow image/PDF formats that we can process
    
    Why we don't store files permanently:
    - Privacy: Medical bills contain sensitive personal health information
    - Storage cost: Keeping files long-term increases infrastructure cost
    - Legal compliance: Medical data has strict retention requirements
    - User trust: Temporary storage shows we don't keep their data longer than needed
    """
    
    # Validate file type
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return UploadResponse(
            success=False,
            error=f"Unsupported file type: {file_ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Create temporary filename
    temp_filename = f"bill_{uuid.uuid4().hex}{file_ext}"
    temp_file_path = Path(tempfile.gettempdir()) / temp_filename
    
    try:
        # Read and save file
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) > MAX_FILE_SIZE:
            return UploadResponse(
                success=False,
                error=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024:.0f} MB"
            )
        
        # Write to temp file
        temp_file_path.write_bytes(file_content)
        
        return UploadResponse(
            success=True,
            file_path=str(temp_file_path),
            file_id=temp_filename,
            size=len(file_content)
        )
    
    except Exception as e:
        return UploadResponse(
            success=False,
            error=f"Upload failed: {str(e)}"
        )


@app.post("/analyze-bill", response_model=BillAnalysisResult)
async def analyze_bill_endpoint(file_path: str):
    """
    Analyze a bill file and return potential overcharge analysis.
    
    This endpoint:
    1. Extracts text from the uploaded file (OCR)
    2. Parses text into line items
    3. Compares prices against reference prices
    4. Calculates potential savings
    5. Returns analysis with verdict (GREEN/YELLOW/RED)
    
    Args:
        file_path: Path to previously uploaded file
    
    Returns:
        BillAnalysisResult with detailed analysis
    
    Process Flow:
    - OCR Module (ocr.py): Extract text from image/PDF
    - Parser Module (parser.py): Clean and structure the text
    - Analyzer Module (analyzer.py): Compare prices and analyze
    
    Safety Rules (MANDATORY):
    - Never say "fraud" or "cheating"
    - Always say "may be higher than usual"
    - Always include disclaimer
    """
    
    try:
        # Verify file exists
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=400,
                detail="File not found. Please upload first."
            )
        
        # Step 1: Extract text using OCR
        try:
            ocr_lines = extract_text(file_path)
            if not ocr_lines:
                raise HTTPException(
                    status_code=400,
                    detail="No text found in image. Please check image quality."
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"OCR extraction failed: {str(e)}"
            )
        
        # Step 2: Parse text into structured items
        try:
            parsed_items = parse_bill(ocr_lines)
            if not parsed_items:
                raise HTTPException(
                    status_code=400,
                    detail="Could not parse any items from the bill."
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Bill parsing failed: {str(e)}"
            )
        
        # Step 3: Analyze for overcharges
        try:
            analysis_result = analyze_bill(parsed_items)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {str(e)}"
            )
        
        # Step 4: Build and return response
        items_analysis = [
            ItemAnalysis(**item) for item in analysis_result.get("items_analysis", [])
        ]
        
        return BillAnalysisResult(
            verdict=analysis_result.get("verdict", "GREEN"),
            possible_savings=analysis_result.get("possible_savings", 0),
            total_billed=analysis_result.get("total_billed", 0),
            items_analysis=items_analysis,
            disclaimer=analysis_result.get("disclaimer", "")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
    
    finally:
        # Clean up temporary file
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete temporary file: {e}")


@app.get("/example-analysis")
async def example_analysis():
    """
    Returns an example analysis result for testing.
    
    Useful for frontend developers to test UI without uploading files.
    """
    from backend.schemas import EXAMPLE_BILL_ANALYSIS
    return EXAMPLE_BILL_ANALYSIS


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=port,
        reload=os.getenv("ENV", "development") == "development"
    )
