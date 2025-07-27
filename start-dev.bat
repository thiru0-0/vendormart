@echo off
echo 🚀 Starting VendorMart Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📡 Starting backend server...
cd server

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please review and update if needed.
)

REM Start backend
echo 🚀 Starting backend on port 3001...
start "VendorMart Backend" cmd /k "npm run dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend...
cd ..
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo 🚀 Starting frontend on port 5173...
start "VendorMart Frontend" cmd /k "npm run dev"

echo.
echo 🎉 VendorMart is starting up!
echo 📡 Backend: http://localhost:3001
echo 🌐 Frontend: http://localhost:5173
echo.
echo Close the command windows to stop the servers
pause 