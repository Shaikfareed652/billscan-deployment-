import os
from typing import Any, Dict
from pymongo import MongoClient

_client = None
_db = None


def get_db():
    global _client, _db
    if _db is not None:
        return _db
    mongo_uri = os.getenv("MONGO_URI") or "mongodb://localhost:27017"
    _client = MongoClient(mongo_uri)
    _db = _client["bill_analysis"]
    return _db


def save_report(data: Dict[str, Any]) -> None:
    """Persist a report document into MongoDB.

    This function intentionally returns None to match the requested signature.
    """
    db = get_db()
    col = db.get_collection("reports")
    try:
        col.insert_one(data)
    except Exception:
        # bubble up to caller; caller can handle exceptions
        raise
