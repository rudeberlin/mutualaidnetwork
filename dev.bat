@echo off
REM Development script to run both frontend and backend (Windows)

echo 🚀 Starting Mutual Aid Network Development Environment
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
    echo ✅ Frontend dependencies installed
    echo.
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
    echo.
)

REM Create uploads directory
if not exist "backend\uploads" (
    mkdir backend\uploads
)
echo 📁 Uploads directory ready
echo.

REM Start servers
echo 🎉 Starting servers...
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on: http://localhost:5000
echo.
echo Close this window or press Ctrl+C to stop servers
echo.

REM Create two new command prompts for each server
start "Mutual Aid Frontend" npm run dev
cd backend
start "Mutual Aid Backend" npm run dev
cd ..

pause
