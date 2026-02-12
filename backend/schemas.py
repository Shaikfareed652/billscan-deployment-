"""
Pydantic Schemas for Request/Response Validation

Pydantic is a Python library that validates data using type hints.

Why structured responses are important:
1. Consistency: All responses follow the same format
2. Validation: Invalid data is caught before sending to client
3. Documentation: Clients know exactly what to expect
4. Type Safety: Frontend can rely on correct data types
5. Swagger Auto-docs: FastAPI automatically generates API documentation

This file defines the request and response models.
"""

from typing import List, Optional
from pydantic import BaseModel


class PriceReference(BaseModel):
    """Reference price for comparison"""
    item: str
    amount: float
    expected_price: float
    confidence: str


class ItemAnalysis(BaseModel):
    """Analysis of a single bill item"""
    item: str
    billed: float
    expected: float
    difference: float
    confidence: str  # "HIGH", "MEDIUM", "LOW"
    message: str


class BillAnalysisResult(BaseModel):
    """Final analysis result returned to client"""
    verdict: str  # "GREEN", "YELLOW", "RED"
    possible_savings: float
    total_billed: float
    items_analysis: List[ItemAnalysis]
    disclaimer: str


class UploadResponse(BaseModel):
    """Response from file upload endpoint"""
    success: bool
    file_path: Optional[str] = None
    file_id: Optional[str] = None
    error: Optional[str] = None
    size: Optional[int] = None


class AnalysisRequest(BaseModel):
    """Request body for analysis endpoint"""
    file_path: str


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str = "Service is running"


# Example data for testing
EXAMPLE_BILL_ANALYSIS = {
    "verdict": "YELLOW",
    "possible_savings": 400,
    "total_billed": 1200,
    "items_analysis": [
        {
            "item": "CBC Test",
            "billed": 1200,
            "expected": 800,
            "difference": 400,
            "confidence": "MEDIUM",
            "message": "May be higher than usual (₹400 more)"
        }
    ],
    "disclaimer": "⚠️ DISCLAIMER: This tool provides informational insights only. It is NOT legal, medical, or financial advice."
}
