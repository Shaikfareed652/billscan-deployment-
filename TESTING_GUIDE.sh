#!/bin/bash
# Hospital Bill Analyzer - Complete Testing Guide

# Start the server first:
# uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

# ============================================================================
# 1. HEALTH CHECK
# ============================================================================

echo "==== Testing Health Check ===="
curl -s http://localhost:8000/health | jq '.'
echo ""

# Expected output:
# {
#   "status": "ok",
#   "message": "Service is running"
# }

# ============================================================================
# 2. UPLOAD A BILL
# ============================================================================

echo "==== Testing File Upload ===="

# Option A: Upload a test image (if available)
if [ -f "backend/uploads/hos.png" ]; then
    UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:8000/upload-bill \
      -F "file=@backend/uploads/hos.png")
    FILE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.file_id')
    echo "Upload response:"
    echo $UPLOAD_RESPONSE | jq '.'
    echo "File ID: $FILE_ID"
else
    echo "Creating test bill image..."
    # For testing without a real image, we can skip upload
    echo "Sample upload command:"
    echo "curl -X POST http://localhost:8000/upload-bill -F 'file=@your_bill.jpg'"
fi
echo ""

# Expected output:
# {
#   "file_id": "a1b2c3d4e5f6.jpg",
#   "success": true,
#   "error": null
# }

# ============================================================================
# 3. TEST FILE VALIDATION
# ============================================================================

echo "==== Testing File Validation ===="

# Test 1: Invalid file type (should return error)
echo "Test 1: Invalid file type"
echo "create dummy file" > /tmp/test.txt
curl -s -X POST http://localhost:8000/upload-bill \
  -F "file=@/tmp/test.txt" | jq '.'
echo ""

# Test 2: Invalid file type message
echo "Test 2: Expected error for .txt file"
echo "{\"success\": false, \"error\": \"unsupported file type .txt\"}"
echo ""

# ============================================================================
# 4. SAMPLE ANALYSIS RESPONSE (for testing frontend without OCR)
# ============================================================================

echo "==== Sample Analysis Response (for Frontend Testing) ===="

cat << 'EOF'
{
  "items": [
    {
      "name": "Room Charges (Private)",
      "bill_amount": 5000,
      "reference_price": 3000,
      "difference": 2000,
      "verdict": "Overpriced"
    },
    {
      "name": "CBC Test",
      "bill_amount": 1500,
      "reference_price": 800,
      "difference": 700,
      "verdict": "Overpriced"
    },
    {
      "name": "MRI Brain",
      "bill_amount": 12000,
      "reference_price": 15000,
      "difference": -3000,
      "verdict": "Normal"
    },
    {
      "name": "Consultation Fee",
      "bill_amount": 1000,
      "reference_price": 500,
      "difference": 500,
      "verdict": "Overpriced"
    },
    {
      "name": "IV Fluids",
      "bill_amount": 4000,
      "reference_price": 4000,
      "difference": 0,
      "verdict": "Normal"
    },
    {
      "name": "Paracetamol 500mg",
      "bill_amount": 100,
      "reference_price": 2.5,
      "difference": 97.5,
      "verdict": "Overpriced"
    }
  ],
  "summary": {
    "total_items": 6,
    "overpriced_count": 4
  }
}
EOF

echo ""
echo "This shows what the /analyze endpoint returns."
echo ""

# ============================================================================
# 5. COMPLETE WORKFLOW
# ============================================================================

echo "==== Complete Workflow ===="
echo ""
echo "Step 1: Upload bill"
echo "  curl -X POST http://localhost:8000/upload-bill -F 'file=@bill.jpg'"
echo ""
echo "Step 2: Note the file_id from response"
echo "  Example: '1a2b3c4d5e6f.jpg'"
echo ""
echo "Step 3: Analyze bill"
echo "  curl -X POST http://localhost:8000/analyze/1a2b3c4d5e6f.jpg"
echo ""
echo "Step 4: View results (JSON format)"
echo "  - items: List of analyzed items with verdicts"
echo "  - summary: Total count and overpriced count"
echo ""

# ============================================================================
# 6. API ENDPOINTS REFERENCE
# ============================================================================

echo "==== API Endpoints Reference ===="
echo ""
echo "Health Check"
echo "  GET /health"
echo "  Returns: {\"status\": \"ok\", \"message\": \"Service is running\"}"
echo ""
echo "Upload Bill"
echo "  POST /upload-bill"
echo "  Content-Type: multipart/form-data"
echo "  Fields: file (JPG, PNG, PDF, max 10MB)"
echo "  Returns: {\"file_id\": \"...\", \"success\": true, \"error\": null}"
echo ""
echo "Analyze Bill"
echo "  POST /analyze/{file_id}"
echo "  Returns: {\"items\": [...], \"summary\": {...}}"
echo ""
echo "API Documentation"
echo "  GET /docs (Swagger UI)"
echo "  GET /redoc (ReDoc)"
echo "  GET /openapi.json (OpenAPI spec)"
echo ""

# ============================================================================
# 7. CURL EXAMPLES
# ============================================================================

echo "==== Curl Command Examples ===="
echo ""

echo "# Health check"
echo 'curl http://localhost:8000/health'
echo ""

echo "# Upload bill"
echo 'curl -X POST http://localhost:8000/upload-bill -F "file=@bill.jpg"'
echo ""

echo "# Analyze bill (replace FILE_ID with actual ID)"
echo 'curl -X POST http://localhost:8000/analyze/FILE_ID'
echo ""

echo "# Pretty print JSON response"
echo 'curl -s -X POST http://localhost:8000/analyze/FILE_ID | jq'
echo ""

echo "# With verbose output"
echo 'curl -v -X POST http://localhost:8000/upload-bill -F "file=@bill.jpg"'
echo ""

echo "# Follow redirects (if needed)"
echo 'curl -L -X POST http://localhost:8000/analyze/FILE_ID'
echo ""

# ============================================================================
# 8. PYTHON TESTING
# ============================================================================

echo "==== Python Testing Script ===="
echo ""

cat << 'PYTHON_SCRIPT'
#!/usr/bin/env python3
import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"

def health_check():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Check:")
    print(f"  Status: {response.status_code}")
    print(f"  Response: {response.json()}")
    return response.status_code == 200

def upload_bill(file_path):
    """Upload a bill image"""
    if not Path(file_path).exists():
        print(f"File not found: {file_path}")
        return None
    
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(f"{BASE_URL}/upload-bill", files=files)
    
    print(f"Upload Bill ({file_path}):")
    print(f"  Status: {response.status_code}")
    print(f"  Response: {response.json()}")
    
    if response.status_code == 200:
        return response.json().get("file_id")
    return None

def analyze_bill(file_id):
    """Analyze uploaded bill"""
    response = requests.post(f"{BASE_URL}/analyze/{file_id}")
    
    print(f"Analyze Bill ({file_id}):")
    print(f"  Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"  Total Items: {result['summary']['total_items']}")
        print(f"  Overpriced Items: {result['summary']['overpriced_count']}")
        print(f"  Items:")
        for item in result['items']:
            print(f"    - {item['name']}: {item['bill_amount']} (ref: {item['reference_price']}) = {item['verdict']}")
    else:
        print(f"  Error: {response.text}")
    
    return response.status_code == 200

def main():
    print("=== Hospital Bill Analyzer - Testing ===\n")
    
    # Test 1: Health check
    if not health_check():
        print("Health check failed - is server running?")
        return
    
    print()
    
    # Test 2: Upload bill
    # Replace with actual path to a bill image
    bill_file = "backend/uploads/hos.png"
    file_id = upload_bill(bill_file)
    
    if not file_id:
        print("Upload failed")
        return
    
    print()
    
    # Test 3: Analyze bill
    analyze_bill(file_id)

if __name__ == "__main__":
    main()
PYTHON_SCRIPT

echo ""
echo "Save this as test_api.py and run:"
echo "  python test_api.py"
echo ""

# ============================================================================
# 9. PERFORMANCE TESTING
# ============================================================================

echo "==== Performance Testing ===="
echo ""
echo "To measure request times:"
echo ""
echo "Using curl with time measurement:"
echo 'time curl -s -X POST http://localhost:8000/analyze/FILE_ID > /dev/null'
echo ""
echo "Using Python for detailed timing:"
echo ''
cat << 'TIMING_SCRIPT'
import requests
import time

start = time.time()
response = requests.post("http://localhost:8000/analyze/FILE_ID")
duration = time.time() - start

print(f"Request took {duration:.2f} seconds")
print(f"Status: {response.status_code}")
TIMING_SCRIPT

echo ""

# ============================================================================
# 10. EDGE CASES TO TEST
# ============================================================================

echo "==== Edge Cases to Test ===="
echo ""
echo "1. Invalid file type"
echo "   echo 'test' > test.txt"
echo "   curl -X POST http://localhost:8000/upload-bill -F 'file=@test.txt'"
echo ""
echo "2. File too large (>10MB)"
echo "   dd if=/dev/zero of=large.jpg bs=1M count=11"
echo "   curl -X POST http://localhost:8000/upload-bill -F 'file=@large.jpg'"
echo ""
echo "3. File not found during analysis"
echo "   curl -X POST http://localhost:8000/analyze/nonexistent.jpg"
echo ""
echo "4. Poor image quality (no readable text)"
echo "   Create blank image and upload"
echo "   Expected: Analysis with empty items list"
echo ""
echo "5. Malformed bill (no amounts)"
echo "   Bill with text but no numeric values"
echo "   Expected: Empty items, summary with 0 items"
echo ""

# ============================================================================
# 11. LOAD TESTING (Optional)
# ============================================================================

echo "==== Load Testing (Optional) ===="
echo ""
echo "Using Apache Bench (ab):"
echo '  ab -n 10 -c 2 http://localhost:8000/health'
echo ""
echo "Using wrk:"
echo '  wrk -t2 -c2 -d10s http://localhost:8000/health'
echo ""
echo "Using hey:"
echo '  hey -n 100 -c 10 http://localhost:8000/health'
echo ""

# ============================================================================
# 12. DEBUGGING TIPS
# ============================================================================

echo "==== Debugging Tips ===="
echo ""
echo "View all routes:"
echo "  curl http://localhost:8000/openapi.json | jq '.paths'"
echo ""
echo "Check response headers:"
echo "  curl -i http://localhost:8000/health"
echo ""
echo "Capture full conversation:"
echo "  curl -v http://localhost:8000/health"
echo ""
echo "Test with custom headers:"
echo "  curl -H 'Custom-Header: value' http://localhost:8000/health"
echo ""
echo "Check server logs:"
echo "  Logs appear in the terminal running uvicorn"
echo ""
echo "Test with request timeout:"
echo "  curl --max-time 5 http://localhost:8000/analyze/FILE_ID"
echo ""

echo "==== Testing Complete ===="
echo ""
echo "Next: Integrate results with frontend"
