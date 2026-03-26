```markdown
shaikfareedmain5678

Overview
--------

Rule-based FastAPI backend for hospital bill analysis (OCR → parse → compare).

Project layout (relevant)
-------------------------

- backend/
	- app/
		- main.py               # FastAPI app (single entrypoint)
		- api/routes.py         # /analyze-bill, /health routes
		- core/ocr.py           # EasyOCR helpers (CPU only)
		- core/parser.py        # Regex-based parser
		- core/analyzer.py      # Price comparison logic
	- price_reference.json

- frontend/ (or use project `src` if you have Vite app here)


Run instructions
----------------

BACKEND RUN STEPS:

1. Change into the backend folder:

```bash
cd backend
```

2. Create and activate a virtualenv:

Linux / macOS:
```bash
python -m venv venv
source venv/bin/activate
```

Windows (PowerShell):
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server (preferred):
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```


The API will be available at http://localhost:8000 and OpenAPI at /docs.


FRONTEND RUN STEPS:

1. Change into the frontend folder (update path if your frontend lives in `src`):

```bash
cd frontend
```

2. Install and run:
```bash
npm install
npm run dev
```

Notes & Requirements
--------------------
- CORS is restricted to `http://localhost:5173`.
- The API exposes a single combined endpoint:
	- `POST /analyze-bill` — accepts `file` form field, saves with UUID, runs EasyOCR (CPU-only), parses, compares with `price_reference.json`, returns JSON immediately.
- Health check: `GET /` returns `{"status": "Bill Analyzer API Running"}`.
- EasyOCR is configured CPU-only: `easyocr.Reader(['en'], gpu=False)`. Ensure `easyocr` is installed for OCR features.
- There is only one FastAPI app instance at `backend/app/main.py`.

If you want, I can also:
- Run a smoke test here (requires installing `easyocr` in the container).
- Update project docs to point to the correct frontend folder.

```
shaikfareedmain5678
