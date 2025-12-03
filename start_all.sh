#!/bin/bash

export PATH=$HOME/.daml/bin:$PATH
# Kill existing processes
echo "Stopping existing processes..."
pkill -f "daml"
pkill -f "canton"
pkill -f "node"
# Wait for processes to actually exit
sleep 2

# Function to check if a port is open
wait_for_port() {
    local port=$1
    local name=$2
    local max_retries=30
    local count=0
    
    echo "Waiting for $name to be ready on port $port..."
    while ! nc -z localhost $port; do
        sleep 2
        count=$((count+1))
        if [ $count -ge $max_retries ]; then
            echo "Error: $name timed out waiting for port $port"
            return 1
        fi
        echo -n "."
    done
    echo ""
    echo "$name is ready!"
    return 0
}

# Start DAML Ledger
echo "Building DAML Model..."
cd packages/daml-model
daml build
if [ $? -ne 0 ]; then
    echo "Error: DAML build failed"
    exit 1
fi

echo "Starting DAML Sandbox..."
daml sandbox --config canton_simple.conf &
SANDBOX_PID=$!

# Wait for Sandbox (Port 5011)
wait_for_port 5011 "DAML Sandbox" || exit 1

echo "Starting JSON API..."
daml json-api --ledger-host localhost --ledger-port 5011 --http-port 7575 --allow-insecure-tokens &
JSON_API_PID=$!

# Wait for JSON API (Port 7575)
wait_for_port 7575 "JSON API" || exit 1

echo "Running Init Script..."
daml script --dar .daml/dist/cantara-daml-model-0.0.1.dar --ledger-host localhost --ledger-port 5011 --script-name Cantara.Setup:completeSetup
if [ $? -ne 0 ]; then
    echo "Error: Init script failed"
    # Don't exit here, sometimes it fails if already initialized, but we should be careful
    echo "Continuing anyway..."
fi

cd ../..

# Start Backend
echo "Starting Backend..."
./start_backend.sh &
BACKEND_PID=$!

# Wait for Backend (Port 4000)
wait_for_port 4000 "Backend" || exit 1

# Start Oracle Bot
echo "Starting Oracle Bot..."
export ORACLE_PRICE_SOURCE=coingecko
export ORACLE_POLL_INTERVAL_MS=10000
cd apps/oracle-bot
npm start &
ORACLE_PID=$!
cd ../..

# Start Frontend
echo "Starting Frontend..."
cd apps/frontend
npm run dev &
FRONTEND_PID=$!
cd ../..

echo "All services started successfully!"
echo "Sandbox PID: $SANDBOX_PID"
echo "JSON API PID: $JSON_API_PID"
echo "Backend PID: $BACKEND_PID"
echo "Oracle PID: $ORACLE_PID"
echo "Frontend PID: $FRONTEND_PID"

# Keep script running
wait
