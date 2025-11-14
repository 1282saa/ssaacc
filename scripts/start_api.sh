#!/bin/bash

echo "Stopping any existing API server..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
ps aux | grep "api_server.py" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

echo "Waiting..."
/bin/sleep 3

echo "Starting API server..."
cd "$(dirname "$0")"
nohup python3 api_server.py > /tmp/finkurn_api_server.log 2>&1 &

echo "Server starting... waiting 8 seconds..."
/bin/sleep 8

echo ""
echo "Testing server..."
curl -s http://localhost:8000/ | python3 -m json.tool

echo ""
echo "Server logs:"
tail -10 /tmp/finkurn_api_server.log

echo ""
echo "✅ API Server started on http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🔍 Health check: http://localhost:8000/health"
