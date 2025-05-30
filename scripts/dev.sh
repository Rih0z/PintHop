#!/bin/bash

# PintHop Development Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if node_modules exist
check_dependencies() {
    if [ ! -d "backend/node_modules" ]; then
        print_warning "Backend dependencies not installed. Installing..."
        cd backend && npm install && cd ..
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        print_warning "Frontend dependencies not installed. Installing..."
        cd frontend && npm install && cd ..
    fi
}

# Check if .env files exist
check_env_files() {
    if [ ! -f "backend/.env" ]; then
        print_warning "Backend .env file not found. Creating from example..."
        cp backend/.env.example backend/.env
        print_warning "Please update backend/.env with your configuration"
    fi
    
    if [ ! -f "frontend/.env" ]; then
        print_warning "Frontend .env file not found. Creating from example..."
        cp frontend/.env.example frontend/.env
        print_warning "Please update frontend/.env with your configuration"
    fi
}

# Main script
case "$1" in
    "start")
        print_status "Starting PintHop development environment..."
        check_dependencies
        check_env_files
        
        # Use concurrently if available
        if command -v concurrently &> /dev/null; then
            concurrently --kill-others "cd backend && npm run dev" "cd frontend && npm start"
        else
            print_warning "concurrently not installed. Installing globally..."
            npm install -g concurrently
            concurrently --kill-others "cd backend && npm run dev" "cd frontend && npm start"
        fi
        ;;
        
    "test")
        print_status "Running all tests..."
        cd backend && npm test && cd ..
        cd frontend && npm test && cd ..
        ;;
        
    "lint")
        print_status "Running linters..."
        cd backend && npm run lint && cd ..
        cd frontend && npm run lint 2>/dev/null || print_warning "Frontend lint not configured"
        ;;
        
    "build")
        print_status "Building production bundles..."
        cd backend && npm run build && cd ..
        cd frontend && npm run build && cd ..
        ;;
        
    "seed")
        print_status "Seeding database..."
        cd backend && npm run seed && cd ..
        ;;
        
    "clean")
        print_status "Cleaning node_modules and build artifacts..."
        rm -rf backend/node_modules backend/dist
        rm -rf frontend/node_modules frontend/build
        print_status "Clean complete"
        ;;
        
    *)
        echo "Usage: ./scripts/dev.sh {start|test|lint|build|seed|clean}"
        echo ""
        echo "Commands:"
        echo "  start  - Start development servers (frontend & backend)"
        echo "  test   - Run all tests"
        echo "  lint   - Run linters"
        echo "  build  - Build production bundles"
        echo "  seed   - Seed database with initial data"
        echo "  clean  - Remove node_modules and build artifacts"
        exit 1
        ;;
esac