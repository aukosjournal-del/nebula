#!/bin/bash
set -e

echo "Building Nebula frontend for Vercel..."

# Set environment variable
export VITE_API_URL=https://nebula-backend-ytb5.onrender.com

# Build frontend
cd frontend
echo "Installing frontend dependencies..."
bun install

echo "Building frontend with Vite..."
bun run build

echo "✅ Build complete!"
