#!/bin/bash

# Upload bill and analyze it
echo "📤 Uploading bill file..."
UPLOAD_RESPONSE=$(curl -s -F "file=@/workspaces/shaikfareedmain5678/backend/uploads/hos.png" http://localhost:8000/upload-bill)
echo "Upload Response:"
echo "$UPLOAD_RESPONSE" | python3 -m json.tool

FILE_PATH=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['file_path'])")
echo ""
echo "🔍 File saved at: $FILE_PATH"
echo ""

# Verify file exists
if [ -f "$FILE_PATH" ]; then
    echo "✅ File exists in /tmp"
    ls -lh "$FILE_PATH"
else
    echo "❌ File not found"
    exit 1
fi

echo ""
echo "🔄 Analyzing bill..."
echo ""
curl -s -X POST "http://localhost:8000/analyze-bill?file_path=$FILE_PATH" | python3 -m json.tool

echo ""
echo "✅ Analysis complete!"
