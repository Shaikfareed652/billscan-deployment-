# Backend for OCR + ML bill analysis

Prerequisites
- Python 3.10
- Google Cloud Vision credentials (service account JSON)
- MongoDB instance and URI

Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Set environment variables (or copy `.env.example` to `.env`):

```bash
export MONGO_URI="your_mongo_uri"
export GCP_CREDENTIALS_PATH="/path/to/creds.json"
export GOOGLE_APPLICATION_CREDENTIALS="$GCP_CREDENTIALS_PATH"
```

Run server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

Test upload (replace `bill.jpg` with your file):

```bash
curl -X POST "http://localhost:5000/upload" -F "file=@bill.jpg" -H "accept: application/json"
```

Notes
- PDF support attempts to convert the first page via `pdf2image`; install `poppler` on the system if using PDF uploads.
- If OCR or ML fails the API returns a JSON error with `detail`.