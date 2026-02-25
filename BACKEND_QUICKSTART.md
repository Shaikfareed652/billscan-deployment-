# Hospital Bill Analyzer Backend - Quick Start Guide

## Overview

A production-ready FastAPI backend for analyzing structured hospital bills using EasyOCR and rule-based price comparison.

**Key Features:**
- ✅ Rule-based analysis (no ML complexity)
- ✅ Image and PDF support
- ✅ OCR text extraction with EasyOCR
- ✅ Regex-based bill parsing
- ✅ Price reference comparison
- ✅ Built-in security and error handling
- ✅ Automatic file cleanup
- ✅ Modular, testable code

---

## Installation & Setup

### 1. Install Dependencies
```bash
cd /workspaces/shaikfareedmain5678
pip install -r backend/requirements.txt
```

### 2. Verify Installation
```bash
python test_backend.py
```

Expected output:
```
✓ All modules imported successfully
✓ UploadResponse schema valid
✓ ItemComparison schema valid
✓ AnalysisResponse schema valid
✓ Parser correctly handled 5 items
✓ Loaded 8 reference prices
✓ Analysis completed successfully
```

---

## Running the Server

### Development Mode (with auto-reload)
```bash
cd /workspaces/shaikfareedmain5678
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
cd /workspaces/shaikfareedmain5678
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Via Environment Variable
```bash
PORT=8000 python -m uvicorn backend.app.main:app
```

### Expected Output
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## API Endpoints

### 1. Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "message": "Service is running"
}
```

**cURL:**
```bash
curl http://localhost:8000/health
```

---

### 2. Upload Bill
**POST** `/upload-bill`

Accepts: JPG, PNG, PDF (max 10MB)

**cURL:**
```bash
curl -X POST http://localhost:8000/upload-bill \
  -F "file=@/path/to/bill.jpg"
```

Response:
```json
{
  "file_id": "a1b2c3d4e5f6.jpg",
  "success": true,
  "error": null
}
```

**Validation:**
- ✅ File extension must be `.jpg`, `.jpeg`, `.png`, or `.pdf`
- ✅ File size must be ≤ 10MB
- ✅ Returns descriptive error if validation fails

---

### 3. Analyze Bill
**POST** `/analyze/{file_id}`

Takes the `file_id` from the upload response and performs full analysis.

**cURL:**
```bash
curl -X POST http://localhost:8000/analyze/a1b2c3d4e5f6.jpg
```

Response:
```json
{
  "items": [
    {
      "name": "Room Charges Private",
      "bill_amount": 5000,
      "reference_price": 3000,
      "difference": 2000,
      "verdict": "Overpriced"
    },
    {
      "name": "CBC Test",
      "bill_amount": 1200,
      "reference_price": 800,
      "difference": 400,
      "verdict": "Overpriced"
    },
    {
      "name": "MRI Brain",
      "bill_amount": 12000,
      "reference_price": 15000,
      "difference": -3000,
      "verdict": "Normal"
    }
  ],
  "summary": {
    "total_items": 3,
    "overpriced_count": 2
  }
}
```

---

## Interactive API Documentation

Once the server is running, access:

- **Swagger UI** (Interactive): http://localhost:8000/docs
- **ReDoc** (Detailed): http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

These provide interactive request/response testing.

---

## Complete Workflow Example

### Step 1: Start the server
```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Upload a bill image
```bash
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:8000/upload-bill \
  -F "file=@sample_bill.jpg")

FILE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.file_id')
echo "Uploaded file ID: $FILE_ID"
```

### Step 3: Analyze the bill
```bash
curl -s -X POST http://localhost:8000/analyze/$FILE_ID | jq '.'
```

### Step 4: View results
The analysis includes:
- Extracted items and amounts
- Comparison with reference prices
- Verdict (Overpriced / Normal)
- Summary statistics

---

## Configuration

### Price Reference Database
Location: `backend/price_reference.json`

Format:
```json
{
  "price_reference": [
    {
      "item": "CBC Test",
      "price": 800,
      "source": "Government benchmark"
    },
    {
      "item": "MRI Brain",
      "price": 15000,
      "source": "Market average"
    }
  ]
}
```

### CORS Settings
File: `backend/app/main.py`

Current configuration (localhost only):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://127.0.0.1"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For development with frontend:**
```python
allow_origins=["http://localhost:3000", "http://localhost:5173"]  # Vite dev server
```

**For production:**
```python
allow_origins=["https://yourdomain.com"]
```

---

## File Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app initialization
│   ├── api/routes.py              # Endpoint definitions
│   ├── core/
│   │   ├── ocr.py                 # EasyOCR integration
│   │   ├── parser.py              # Regex-based bill parsing
│   │   └── analyzer.py            # Price comparison logic
│   └── models/schemas.py          # Pydantic models
├── uploads/                        # Temporary file storage
├── price_reference.json           # Reference price database
└── requirements.txt               # Dependencies
```

---

## How It Works

### 1. Upload Phase
User uploads a bill image/PDF → Saved with UUID filename → Returns file_id

### 2. OCR Phase
EasyOCR extracts text lines from image/PDF → Returns list of strings

### 3. Parsing Phase
Regex pattern extracts item name and amount from each line:
```
Regex: r"^(.*?)\s+₹?\s?([\d,]+(?:\.\d+)?)$"
```

Example:
```
Input:  "Room Charges (Private) 5000"
Output: {"name": "Room Charges (Private)", "amount": 5000}
```

### 4. Analysis Phase
Compare extracted amount with reference price:
```
if extracted_amount > reference_price:
    verdict = "Overpriced"
else:
    verdict = "Normal"
```

### 5. Cleanup Phase
File automatically deleted after analysis → Returns structured JSON response

---

## Error Handling

### Common Errors

**400 - Invalid File**
```json
{
  "detail": "unsupported file type .exe"
}
```
→ Ensure file is JPG, PNG, or PDF

**400 - File Too Large**
```json
{
  "detail": "file too large"
}
```
→ Maximum 10MB per file

**404 - File Not Found**
```json
{
  "detail": "file not found"
}
```
→ Upload file first before analyzing

**500 - Analysis Failed**
```json
{
  "detail": "analysis failed: [error details]"
}
```
→ Check file quality, ensure readable text

---

## Performance Optimization

### OCR Model Caching
The EasyOCR reader is initialized globally and reused across requests:
```python
_reader = None

def _init_reader():
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['en'], gpu=False)
    return _reader
```

### Price Reference Caching
Loads once per request (small JSON file, negligible overhead).

### Limitations
- First API call will be slow (EasyOCR model download/load)
- Subsequent calls are fast
- No database - suitable for low-to-medium volume

---

## Testing

### Run Unit Tests
```bash
python test_backend.py
```

### Manual API Testing

**Option 1: cURL**
```bash
# Upload
curl -X POST http://localhost:8000/upload-bill -F "file=@bill.jpg"

# Analyze
curl -X POST http://localhost:8000/analyze/abc123.jpg
```

**Option 2: Python**
```python
import requests

# Upload
with open("bill.jpg", "rb") as f:
    resp = requests.post("http://localhost:8000/upload-bill", 
                        files={"file": f})
file_id = resp.json()["file_id"]

# Analyze
result = requests.post(f"http://localhost:8000/analyze/{file_id}")
print(result.json())
```

**Option 3: Swagger UI**
Navigate to http://localhost:8000/docs and use the interactive interface.

---

## Deployment

### Docker
```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ ./backend

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Run with Docker
```bash
docker build -t bill-analyzer .
docker run -p 8000:8000 bill-analyzer
```

### Environment Variables
```bash
PORT=8000              # Server port
ENV=development        # development | production
```

---

## Security

✅ **File Validation**
- Only JPG, PNG, PDF allowed
- Size limit 10MB
- UUID-based filenames prevent traversal

✅ **CORS Restricted**
- Localhost only by default
- Configure for your frontend domain

✅ **File Cleanup**
- Automatic deletion after analysis
- Error-safe cleanup in finally block

✅ **No Raw Paths**
- No direct file path input from users
- UUID-based file ID system

---

## Troubleshooting

### OCR Model Download Takes Long Time
**Cause:** First-time download of EasyOCR models  
**Solution:** This is normal. Models cache for future requests.

### Port Already in Use
```bash
# Find and kill process
lsof -i :8000
kill -9 <PID>

# Or use different port
uvicorn backend.app.main:app --port 8001
```

### CORS Errors from Frontend
**Cause:** Frontend domain not in `allow_origins`  
**Solution:** Update CORS settings in `backend/app/main.py`

### PDF Processing Fails
**Cause:** Requires `pdf2image` and poppler  
**Solution:** `apt-get install poppler-utils` and re-check requirements

---

## Future Enhancements

- [ ] Database integration for analysis history
- [ ] Async PDF processing for large files
- [ ] Multiple language support
- [ ] Fuzzy item name matching (ML)
- [ ] Batch analysis endpoint
- [ ] Rate limiting
- [ ] Authentication/API keys
- [ ] Caching layer (Redis)
- [ ] Audit logging
- [ ] Webhook notifications

---

## Support

For issues or improvements:
1. Check error logs
2. Verify dependencies installed: `pip list | grep -E "fastapi|easyocr|uvicorn"`
3. Test with sample bill: `backend/uploads/hos.png`
4. Check Swagger UI for API details: `http://localhost:8000/docs`

---

## License

Internal use only. Contains proprietary medical pricing logic.
