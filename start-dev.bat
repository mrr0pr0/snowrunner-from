@echo off
REM SnowRunner Forum - Development Setup Script for Windows
REM This script sets up and runs the database and development servers

echo 🚀 Starting SnowRunner Forum development setup...

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please copy .env.example to .env and configure your DATABASE_URL and JWT_SECRET
    pause
    exit /b 1
)

REM Read environment variables from .env file
echo 📋 Loading environment variables...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="DATABASE_URL" set DATABASE_URL=%%b
    if "%%a"=="JWT_SECRET" set JWT_SECRET=%%b
    if "%%a"=="PORT" set PORT=%%b
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    pnpm install
)

REM Build shared module first
echo 🔨 Building shared module...
cd shared
pnpm run build
cd ..

REM Setup database
echo 🗄️ Setting up database...
cd server
echo Running database migrations...
pnpm run db:push
cd ..

REM Start development servers
echo 🌟 Starting development servers...
echo Server will run on http://localhost:3001
echo Client will run on http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers

REM Start both servers with environment variables
start "Server" cmd /c "set DATABASE_URL=%DATABASE_URL%&& set JWT_SECRET=%JWT_SECRET%&& set PORT=%PORT%&& pnpm run dev:server"
start "Client" cmd /c "pnpm run dev"

pause
