#!/bin/bash
# Complete Guide: Hospital Bill Analyzer - Setup & Usage

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║             🏥 HOSPITAL BILL ANALYZER - COMPLETE SETUP GUIDE               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

✅ STATUS: Both servers are running and configured!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 WHAT'S RUNNING NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BACKEND SERVER
   URL: http://localhost:8000
   Status: Running ✓
   Features:
     • POST /upload-bill - Upload hospital bills
     • POST /analyze/{file_id} - Analyze bills
     • GET /health - Health check
   API Docs: http://localhost:8000/docs

✅ FRONTEND SERVER
   URL: http://localhost:5173
   Status: Running ✓
   Features:
     • Bill upload interface
     • Real-time analysis
     • Verdict display (Green/Yellow/Red)
     • Savings calculation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 HOW TO USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Open the Frontend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Open your browser and go to:
   
   👉 http://localhost:5173

   OR using the port forwarding in VS Code:
   
   👉 Click on "Ports" tab → Click on port 5173 → Open in Browser


STEP 2: Upload a Hospital Bill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   On the website, you'll see:
   
   1. Click the "Choose Bill Image" button (or click anywhere on Hero section)
   2. Select a hospital bill image from your computer
      
      Supported formats: JPG, PNG, GIF, BMP, TIFF, PDF
      Maximum size: 50 MB
   
   3. The page will process your file:
      ✓ Upload the file to backend
      ✓ Extract text using OCR
      ✓ Parse bill items and amounts
      ✓ Compare with reference prices


STEP 3: View the Analysis Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   After processing completes, you'll see:
   
   📊 ANALYSIS REPORT
   
   • Verdict Badge (Color Coded):
     🟢 GREEN  - Bill looks normal (0-20% overpriced items)
     🟡 YELLOW - Some overcharges (20-50% overpriced items)
     🔴 RED    - Mostly overpriced (>50% overpriced items)
   
   • Overpriced Items Count:
     Shows how many items are priced higher than reference
   
   • Possible Savings:
     Total amount you could save if priced at reference level
   
   • Detailed JSON:
     Complete analysis with each item's:
     - Name
     - Bill amount
     - Reference price
     - Difference
     - Verdict (Overpriced/Normal)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 EXAMPLE WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open http://localhost:5173
2. See the website with "Bill Analyzer" header
3. Click "ANALYZE BILL" or click on hero section
4. Choose a hospital bill image file
5. Wait for processing (2-5 seconds)
6. See the analysis report with:
   
   ✓ Verdict badge (GREEN/YELLOW/RED)
   ✓ Number of overpriced items
   ✓ Total possible savings in ₹
   ✓ Full JSON analysis results


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 HOW IT WORKS BEHIND THE SCENES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND (http://localhost:5173)
┌─────────────────────────────────────────────┐
│ 1. User selects bill image                  │
│ 2. Frontend sends to /upload-bill endpoint  │
│ 3. Gets file_id back                        │
│ 4. Sends file_id to /analyze/{file_id}      │
│ 5. Displays results in nice format          │
└─────────────────────────────────────────────┘
                    │
                    ↓
BACKEND (http://localhost:8000)
┌─────────────────────────────────────────────┐
│ 1. /upload-bill endpoint                    │
│    - Validates file type & size             │
│    - Saves with UUID filename               │
│    - Returns file_id                        │
│                                              │
│ 2. /analyze/{file_id} endpoint              │
│    - Loads uploaded file                    │
│    - Extracts text using EasyOCR            │
│    - Parses items using regex               │
│    - Compares with price_reference.json     │
│    - Returns analysis with items & summary  │
│    - Deletes file automatically             │
└─────────────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 WHAT GETS ANALYZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reference Prices (from backend/price_reference.json):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CBC Test                   ₹800
✓ MRI Brain                  ₹15,000
✓ Room Private Per Day       ₹3,000
✓ Paracetamol 500mg          ₹2.5
✓ Blood Test                 ₹500
✓ CT Scan                    ₹12,000
✓ X-Ray Chest                ₹250
✓ Consultation Fee           ₹500

The system compares each item in your bill against these reference prices
and tells you if it's overpriced.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ISSUE: "Cannot GET /"
REASON: Frontend not loading
SOLUTION:
  1. Check if Vite server is running: npm run dev
  2. Open http://localhost:5173
  3. Check terminal for errors


ISSUE: "404 not found" on bill upload
REASON: Backend not responding or wrong endpoint
SOLUTION:
  1. Check if backend is running: ps aux | grep uvicorn
  2. If not running: cd /workspaces/shaikfareedmain5678
     uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
  3. Test health endpoint: curl http://localhost:8000/health
  4. Check CORS: Backend should allow localhost:5173


ISSUE: "Error: Analysis failed"
REASON: OCR extraction or parsing issue
SOLUTION:
  1. Ensure bill image is clear and readable
  2. Try with a different bill image
  3. Check backend logs for detailed error
  4. File must have text (not just scanned image with no text)


ISSUE: "File upload timeout"
REASON: Large file or slow internet
SOLUTION:
  1. Use smaller image or PDF
  2. Maximum file size: 50 MB
  3. Try JPEG format (smaller than PNG)
  4. Crop image to bill portion only


ISSUE: All items showing as "Normal" (none overpriced)
REASON: Bill prices match or are lower than reference
SOLUTION:
  1. This is correct! Your bill is fairly priced
  2. Verdict will be GREEN
  3. No savings available


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆘 QUICK RESTART COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IF YOU NEED TO RESTART EVERYTHING:

1. Stop everything:
   # Press Ctrl+C in all terminals

2. Start backend:
   cd /workspaces/shaikfareedmain5678
   uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

3. Start frontend (in another terminal):
   cd /workspaces/shaikfareedmain5678
   npm run dev

4. Open browser:
   http://localhost:5173


TO CHECK IF SERVERS ARE RUNNING:

Backend:
  curl http://localhost:8000/health
  
Frontend:
  curl http://localhost:5173 (should return HTML)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For detailed technical information, check:

Backend:
  • BACKEND_QUICKSTART.md    ← Start here
  • BACKEND_IMPLEMENTATION.md ← How it works
  • BACKEND_ARCHITECTURE.md   ← Deep dive
  
Testing:
  • TESTING_GUIDE.sh         ← API testing examples
  • test_backend.py          ← Unit tests

API Documentation (Interactive):
  • http://localhost:8000/docs (Swagger UI)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 YOU'RE ALL SET!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:5173  
✅ CORS configured properly
✅ All endpoints working
✅ Ready to analyze bills!

NEXT STEP: Open http://localhost:5173 and upload a hospital bill!

Questions? Check the documentation or test with the API:
  http://localhost:8000/docs (Interactive API docs)

EOF
