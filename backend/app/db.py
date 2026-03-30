from pymongo import MongoClient
import os

_client = None
_db     = None

def get_db():
    global _client, _db
    if _db is not None:
        return _db

    MONGO_URL = os.getenv(
        "MONGODB_URL",
        "mongodb://localhost:27017"
    )

    try:
        _client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        _client.server_info()
        _db = _client["billscan"]
        print(f"[DB] Connected to MongoDB")
    except Exception as e:
        print(f"[DB] MongoDB connection failed: {e}")
        # Return mock db so app doesn't crash
        class MockDB:
            def __getitem__(self, name):
                return MockCollection()
        class MockCollection:
            def find(self, *a, **k):       return []
            def find_one(self, *a, **k):   return None
            def insert_one(self, *a, **k): return None
            def update_one(self, *a, **k): return None
        _db = MockDB()

    return _db
