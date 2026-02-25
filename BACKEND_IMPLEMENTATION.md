# Hospital Bill Analysis Backend - Complete Implementation

## Architecture Overview

```
backend/
├── app/
│   ├── main.py              # FastAPI app with CORS middleware
│   ├── __init__.py
│   ├── api/
│   │   ├── routes.py        # API endpoints
│   │   └── __init__.py
│   ├── core/
│   │   ├── ocr.py           # EasyOCR text extraction
│   │   ├── parser.py        # Regex-based bill parsing
│   │   ├── analyzer.py      # Rule-based comparison logic
│   │   └── __init__.py
│   ├── models/
│   │   ├── schemas.py       # Pydantic models
│   │   └── __init__.py
├── uploads/                 # Temporary file storage
├── price_reference.json     # Reference price database
├── requirements.txt         # Dependencies
└── main.py                  # Legacy entry point (re-exports app)
```

## Core Components

### 1. **Schema Models** (`backend/app/models/schemas.py`)
Pydantic models for type validation:

- `UploadResponse`: File upload response with `file_id`, `success`, `error`
- `ItemComparison`: Individual item analysis with `name`, `bill_amount`, `reference_price`, `difference`, `verdict`
- `AnalysisResponse`: Complete analysis with `items` list and `summary` dict

### 2. **OCR Module** (`backend/app/core/ocr.py`)
EasyOCR-based text extraction:

- **Global Reader Initialization**: Lazy-loads EasyOCR reader once for performance
- **Image Support**: JPG, PNG, GIF, BMP, TIFF
- **PDF Support**: Converts first page to PNG via `pdf2image`, then OCR
- **Output**: List of extracted text lines
- **Error Handling**: Checks file existence and format

### 3. **Parser Module** (`backend/app/core/parser.py`)
Rule-based regex parsing for bill tables:

```
Regex Pattern: r"^(.*?)\s+₹?\s?([\d,]+(?:\.\d+)?)$"
```

- Captures leftmost text as item name (lazy match)
- Captures rightmost numeric value as amount (with optional commas)
- Handles both Indian Rupees (₹) and plain numbers
- Converts amounts to floats, removing commas
- Skips malformed lines

**Example Input OCR Lines:**
```
Room Charges 5000
CBC Test ₹1200
MRI Brain 12,500.00
```

**Example Output:**
```json
[
  {"name": "Room Charges", "amount": 5000},
  {"name": "CBC Test", "amount": 1200},
  {"name": "MRI Brain", "amount": 12500}
]
```

### 4. **Analyzer Module** (`backend/app/core/analyzer.py`)
Rule-based price comparison:

**Price Reference Format:**
```json
{
  "price_reference": [
    {"item": "CBC Test", "price": 800},
    {"item": "MRI Brain", "price": 15000},
    {"item": "Room Private Per Day", "price": 3000}
  ]
}
```

**Comparison Logic:**
- Loads price reference JSON
- For each extracted item:
  - Matches item name (case-insensitive)
  - Compares `bill_amount > reference_price`
  - Verdict = "Overpriced" if amount exceeds reference, else "Normal"
- Counts total items and overpriced items

### 5. **Routes** (`backend/app/api/routes.py`)

#### **POST /upload-bill**
Upload a medical bill image or PDF

**Request:** Multipart form with `file` field (JPG, PNG, PDF)

**Response:**
```json
{
  "file_id": "a1b2c3d4e5f6.jpg",
  "success": true
}
```

**Validations:**
- File extension must be in {.jpg, .jpeg, .png, .pdf}
- File size ≤ 10MB
- UUID-based filename ensures uniqueness and security

#### **POST /analyze/{file_id}**
Analyze uploaded bill

**Request Path:** `/analyze/a1b2c3d4e5f6.jpg`

**Response:**
```json
{
  "items": [
    {
      "name": "Room Charges",
      "bill_amount": 5000,
      "reference_price": 3000,
      "difference": 2000,
      "verdict": "Overpriced"
    }
  ],
  "summary": {
    "total_items": 8,
    "overpriced_count": 2
  }
}
```

**Process:**
1. Load file from `uploads/{file_id}`
2. Extract text via OCR
3. Parse bill lines with regex
4. Compare against price reference
5. Delete file (cleanup)
6. Return analysis

#### **GET /health**
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Service is running"
}
```

## Security Features

✅ **No raw file path input**: File IDs are validated against uploads directory
✅ **CORS restricted to localhost**: `allow_origins=["http://localhost", "http://127.0.0.1"]`
✅ **File cleanup**: Automatic deletion after analysis to prevent disk exhaustion
✅ **File type validation**: Only allows images and PDFs
✅ **File size limits**: 10MB maximum to prevent memory issues
✅ **UUID filenames**: Prevents directory traversal and filename collisions

## Error Handling

- **404**: File not found during analysis
- **400**: Invalid file type or size exceeds limit
- **500**: OCR extraction or analysis failures with details
- **File cleanup**: Attempts deletion in `finally` block to ensure cleanup even on errors

## Performance Optimizations

### Global Reader Initialization
EasyOCR model is loaded once globally and reused:
```python
_reader = None

def _init_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['en'], gpu=False)
    return _reader
```

This prevents expensive model reloading on every request.

## Dependencies

```
fastapi==0.115.0
uvicorn==0.34.0
python-multipart==0.0.20
pdf2image==1.17.0
Pillow==10.4.0
easyocr==1.7.1
```

## Running the Backend

### Development
```bash
cd /workspaces/shaikfareedmain5678
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

### With Environment Variable
```bash
PORT=8000 python -m uvicorn backend.app.main:app
```

## API Documentation

Once running, access interactive API docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Example Workflow

1. **Upload Bill**
   ```bash
   curl -X POST "http://localhost:8000/upload-bill" \
     -F "file=@bill.jpg"
   # Returns: {"file_id": "abc123def456.jpg", "success": true}
   ```

2. **Analyze Bill**
   ```bash
   curl -X POST "http://localhost:8000/analyze/abc123def456.jpg"
   # Returns: {"items": [...], "summary": {...}}
   ```

3. **Health Check**
   ```bash
   curl http://localhost:8000/health
   # Returns: {"status": "ok", "message": "Service is running"}
   ```

## Testing

Sample test image in: `/workspaces/shaikfareedmain5678/backend/uploads/hos.png`

## Modular Design Benefits

- **Separation of Concerns**: Each module has a single responsibility
- **Testability**: Can test OCR, parser, and analyzer independently
- **Maintainability**: Easy to swap OCR libraries or modify comparison logic
- **Scalability**: Can add caching, async processing, or database integration
- **Reusability**: Core modules can be used in other services

## Future Enhancements

- Add database to store analysis history
- Implement async PDF processing for large files
- Add support for multiple price reference JSON files
- Add ML-based item matching instead of exact name matching
- Add audit logging for compliance
- Cache reference prices in memory with TTL
