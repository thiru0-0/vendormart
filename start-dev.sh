#!/bin/bash

echo "🚀 Starting VendorMart Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running."
fi

# Start backend server
echo "📡 Starting backend server..."
cd server
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please review and update if needed."
fi

# Start backend in background
echo "🚀 Starting backend on port 3001..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:3001"
else
    echo "❌ Backend failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🌐 Starting frontend..."
cd ..
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🚀 Starting frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo "🎉 VendorMart is starting up!"
echo "📡 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 