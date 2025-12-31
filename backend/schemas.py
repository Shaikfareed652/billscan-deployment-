from typing import List, Optional
from pydantic import BaseModel


class Item(BaseModel):
    name: str
    qty: Optional[int] = 1
    cost: float
    category: Optional[str] = None
    standard_price: Optional[float] = 0.0


class Report(BaseModel):
    anomaly_score: float
    overcharged_items: List[dict]
    summary_text: str
    items: List[Item]


class UploadResponse(BaseModel):
    id: Optional[str]
    report: Optional[Report]
    message: Optional[str]
