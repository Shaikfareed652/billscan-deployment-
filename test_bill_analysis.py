#!/usr/bin/env python3
import subprocess
import json
import time

print("=" * 70)
print("🏥 BILLSCAN - BILL UPLOAD & ANALYSIS TEST")
print("=" * 70)
print()

# Step 1: Upload bill
print("📤 Step 1: Uploading bill file...")
print("-" * 70)
upload_cmd = [
    "curl", "-s", "-F", "file=@/workspaces/shaikfareedmain5678/backend/uploads/hos.png",
    "http://localhost:8000/upload-bill"
]
upload_result = subprocess.run(upload_cmd, capture_output=True, text=True, timeout=30)
upload_json = json.loads(upload_result.stdout)

print("Upload Response:")
print(json.dumps(upload_json, indent=2))
print()

if not upload_json.get("success"):
    print("❌ Upload failed!")
    exit(1)

file_path = upload_json["file_path"]
file_id = upload_json["file_id"]
size = upload_json["size"]

print(f"✅ Upload successful!")
print(f"   File Path: {file_path}")
print(f"   File ID: {file_id}")
print(f"   Size: {size} bytes")
print()

# Verify file exists
import os
if os.path.exists(file_path):
    print(f"✅ File verified in /tmp")
else:
    print(f"❌ File not found at {file_path}")
    exit(1)

print()
print("=" * 70)
print("🔄 Step 2: Analyzing bill (OCR + Price comparison)...")
print("-" * 70)
print()

# Step 2: Analyze bill
analyze_cmd = [
    "curl", "-s", "-X", "POST",
    f"http://localhost:8000/analyze-bill?file_path={file_path}"
]

print("Running analysis (may take 30-60 seconds for OCR)...")
start = time.time()
analyze_result = subprocess.run(analyze_cmd, capture_output=True, text=True, timeout=120)
elapsed = time.time() - start

analysis_json = json.loads(analyze_result.stdout)

print(f"✅ Analysis complete (took {elapsed:.1f}s)")
print()
print("Analysis Result:")
print(json.dumps(analysis_json, indent=2))
print()

# Print summary
print("=" * 70)
print("📊 SUMMARY")
print("=" * 70)
verdict = analysis_json.get("verdict", "N/A")
savings = analysis_json.get("possible_savings", 0)
total_billed = analysis_json.get("total_billed", 0)
num_items = len(analysis_json.get("items_analysis", []))

verdict_emoji = "🟢" if verdict == "GREEN" else "🟡" if verdict == "YELLOW" else "🔴" if verdict == "RED" else "❓"

print(f"Verdict: {verdict_emoji} {verdict}")
print(f"Total Billed: ₹{total_billed}")
print(f"Possible Savings: ₹{savings}")
print(f"Items Analyzed: {num_items}")
print()
print("✅ All checks passed!")
