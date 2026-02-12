# Quick Reference Card 🚀

## Starting the Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**URL:** http://localhost:8000

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/upload-bill` | POST | Upload image/PDF |
| `/analyze-bill` | POST | Analyze bill |
| `/example-analysis` | GET | Sample response |
| `/docs` | GET | Swagger UI |
| `/redoc` | GET | ReDoc |

---

## Upload & Analyze Flow

```javascript
// 1. Upload
POST /upload-bill
body: multipart/form-data (file)
→ { file_path: "/tmp/bill_xxxxx.jpg" }

// 2. Analyze
POST /analyze-bill?file_path=/tmp/bill_xxxxx.jpg
→ { verdict, possible_savings, items_analysis }
```

---

## Response Example

```json
{
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
      "message": "May be higher than usual"
    }
  ],
  "disclaimer": "⚠️ DISCLAIMER: ..."
}
```

---

## Testing

```bash
# Test suite
python test_api.py

# Swagger UI (interactive)
Open: http://localhost:8000/docs

# curl example
curl -X POST "http://localhost:8000/upload-bill" \
  -F "file=@bill.jpg"
```

---

## Verdicts

| Verdict | Meaning |
|---------|---------|
| 🟢 GREEN | No overcharges detected |
| 🟡 YELLOW | Some items may be higher than usual |
| 🔴 RED | Multiple significant overcharges |

---

## Confidence Levels

| Level | Meaning |
|-------|---------|
| HIGH | >50% above reference price |
| MEDIUM | 20-50% above reference price |
| LOW | Within normal range |

---

## File Structure

```
backend/
├── main.py              # FastAPI app
├── ocr.py               # Text extraction
├── parser.py            # Text parsing
├── analyzer.py          # Price analysis
├── schemas.py           # Data models
├── price_reference.json # Reference prices
├── requirements.txt     # Dependencies
├── test_api.py          # Test suite
└── BACKEND_README.md    # Full guide
```

---

## Key Modules

### ocr.py
```python
extract_text(file_path) → List[str]
```
Extracts text from images/PDFs

### parser.py
```python
parse_bill(ocr_lines) → List[Dict]
```
Parses text into structured items

### analyzer.py
```python
analyze_bill(parsed_items) → Dict
```
Compares prices and calculates verdict

---

## Important Notes

⚠️ **Files are temporary** - Deleted after analysis
🛡️ **Never says "fraud"** - Uses safe language
📋 **Always includes disclaimer** - Legal protection
📊 **Shows confidence levels** - Avoids false claims

---

## Frontend Integration

```javascript
import axios from 'axios';

async function analyzeBill(file) {
  // Upload
  const formData = new FormData();
  formData.append('file', file);
  const uploadRes = await axios.post(
    'http://localhost:8000/upload-bill',
    formData
  );
  
  // Analyze
  const result = await axios.post(
    'http://localhost:8000/analyze-bill',
    null,
    { params: { file_path: uploadRes.data.file_path } }
  );
  
  return result.data;
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Change port: `--port 8001` |
| No text found | Check image quality |
| Can't parse items | Try clearer photo |
| Module not found | Run: `pip install -r requirements.txt` |

---

## Documentation

- **Full Guide:** [BACKEND_README.md](backend/BACKEND_README.md)
- **Features:** [IMPLEMENTATION_SUMMARY.md](backend/IMPLEMENTATION_SUMMARY.md)
- **Complete Spec:** [BACKEND_COMPLETE.md](BACKEND_COMPLETE.md)

---

## Deployment

```bash
# Docker
docker build -t api .
docker run -p 8000:8000 api

# Production
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

**Status:** ✅ Ready to use  
**Version:** 1.0.0  
**Last Updated:** 2026-02-03
