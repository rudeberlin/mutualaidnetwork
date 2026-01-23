#!/bin/bash
# Development script to run both frontend and backend

echo "🚀 Starting Mutual Aid Network Development Environment"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Create uploads directory
mkdir -p backend/uploads
echo "📁 Uploads directory ready"
echo ""

# Start both servers
echo "🎉 Starting servers..."
echo ""
echo "Frontend will run on: http://localhost:5173"
echo "Backend will run on: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run frontend and backend concurrently
npm run dev &
FRONTEND_PID=$!

cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Handle cleanup
trap "kill $FRONTEND_PID $BACKEND_PID" EXIT

wait
