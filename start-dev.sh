#!/bin/bash

# SnowRunner Forum - Development Setup Script
# This script sets up and runs the database and development servers

set -e  # Exit on any error

echo "🚀 Starting SnowRunner Forum development setup..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your DATABASE_URL and JWT_SECRET"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Build shared module first
echo "🔨 Building shared module..."
cd shared
pnpm run build
cd ..

# Setup database
echo "🗄️ Setting up database..."
cd server
echo "Running database migrations..."
pnpm run db:push
cd ..

# Start development servers
echo "🌟 Starting development servers..."
echo "Server will run on http://localhost:3001"
echo "Client will run on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Start both servers in background
pnpm run dev:server &
SERVER_PID=$!

pnpm run dev &
CLIENT_PID=$!

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait
