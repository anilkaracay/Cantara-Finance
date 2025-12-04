#!/bin/bash

export PATH=$HOME/.daml/bin:$PATH

# Ensure Java is available for Canton Sandbox
if [ -z "$JAVA_HOME" ] && [ -d "/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home" ]; then
    export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home"
fi
if [ -n "$JAVA_HOME" ]; then
    export PATH="$JAVA_HOME/bin:$PATH"
fi

# Kill existing processes
echo "Stopping existing processes..."
pkill -f "daml"
pkill -f "canton"
pkill -f "node.*backend"
pkill -f "node.*oracle"
pkill -f "node.*frontend"
sleep 3

# Function to check if a port is open
wait_for_port() {
    local port=$1
    local name=$2
    local max_retries=60
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
    echo "✓ $name is ready!"
    return 0
}

echo "======================================"
echo "STEP 1: Building DAML Model"
echo "======================================"
cd packages/daml-model
daml build
if [ $? -ne 0 ]; then
    echo "Error: DAML build failed"
    exit 1
fi
echo "✓ DAML build completed"
echo ""

echo "======================================"
echo "STEP 1.5: Regenerating SDK TypeScript Types"
echo "======================================"
cd ../..
rm -rf packages/sdk/src/daml-types/cantara-daml-model*
daml codegen js -o packages/sdk/src/daml-types packages/daml-model/.daml/dist/cantara-daml-model-0.0.1.dar
echo "✓ SDK codegen completed"
cd packages/sdk
rm -rf dist
npm run build
echo "✓ SDK build completed"
cd ../..

echo "======================================"
echo "STEP 2: Starting DAML Sandbox"
echo "======================================"
cd packages/daml-model
daml sandbox --port 5011 --admin-api-port 5012 > ../../sandbox.log 2>&1 &
SANDBOX_PID=$!
echo "Sandbox PID: $SANDBOX_PID"

wait_for_port 5011 "DAML Sandbox" || exit 1
sleep 5  # Extra wait for sandbox to fully initialize
echo ""

echo "======================================"
echo "STEP 2.5: Uploading DAR File"
echo "======================================"
daml ledger upload-dar .daml/dist/cantara-daml-model-0.0.1.dar --host localhost --port 5011
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload DAR file"
    exit 1
fi
echo "✓ DAR file uploaded"
echo ""

echo "======================================"
echo "STEP 3: Starting JSON API"
echo "======================================"
daml json-api --ledger-host localhost --ledger-port 5011 --http-port 7575 --allow-insecure-tokens > ../../json-api.log 2>&1 &
JSON_API_PID=$!
echo "JSON API PID: $JSON_API_PID"

wait_for_port 7575 "JSON API" || exit 1
sleep 5  # Extra wait for JSON API to fully initialize
echo ""

echo "======================================"
echo "STEP 4: Running Init Script"
echo "======================================"
# Try to run setup script, but don't fail if parties already exist
daml script --dar .daml/dist/cantara-daml-model-0.0.1.dar --ledger-host localhost --ledger-port 5011 --script-name Cantara.Setup:completeSetup 2>&1 | grep -v "Party already exists" || true
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "Warning: Init script had errors (parties might already exist, continuing anyway)"
fi
echo ""

cd ../..

echo "======================================"
echo "STEP 4.5: Updating Tokens"
echo "======================================"
echo "Fetching real Party IDs and updating .env..."
node update_tokens.js
if [ $? -ne 0 ]; then
    echo "Error: Failed to update tokens"
    exit 1
fi
echo "✓ Tokens updated in .env"
echo ""

echo "======================================"
echo "STEP 5: Copying .env to Backend"
echo "======================================"
cp .env apps/backend/.env
echo "✓ .env copied to backend"
echo ""

echo "======================================"
echo "STEP 5.5: Starting Backend"
echo "======================================"
cd apps/backend
npm run dev > ../../backend-sequential.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ../..

wait_for_port 4000 "Backend" || exit 1
sleep 5  # Extra wait for backend to fully initialize
echo ""

echo "======================================"
echo "STEP 6: Starting Oracle Bot"
echo "======================================"
export ORACLE_PRICE_SOURCE=coingecko
export ORACLE_POLL_INTERVAL_MS=10000
cd apps/oracle-bot
npm start > ../../oracle-sequential.log 2>&1 &
ORACLE_PID=$!
echo "Oracle PID: $ORACLE_PID"
cd ../..
sleep 10  # Wait for oracle to complete initial price updates
echo "✓ Oracle Bot started"
echo ""

echo "======================================"
echo "STEP 7: Starting Frontend"
echo "======================================"
cd apps/frontend
npm run dev > ../../frontend-sequential.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ../..

wait_for_port 3000 "Frontend" || exit 1
echo ""

echo "======================================"
echo "STEP 8: Creating Navigator Users"
echo "======================================"
# Get party IDs and create users for Navigator
USER_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "User::" | grep -o "party = '[^']*'" | head -1 | sed "s/party = '\([^']*\)'/\1/")
ADMIN_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "Admin::" | grep -o "party = '[^']*'" | head -1 | sed "s/party = '\([^']*\)'/\1/")
ORACLE_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "OracleUpdater::" | grep -o "party = '[^']*'" | head -1 | sed "s/party = '\([^']*\)'/\1/")
LIQUIDATOR_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "Liquidator::" | grep -o "party = '[^']*'" | head -1 | sed "s/party = '\([^']*\)'/\1/")
INSTITUTION_DEMO_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "InstitutionDemo::" | grep -o "party = '[^']*'" | head -1 | sed "s/party = '\([^']*\)'/\1/")

echo "Party IDs found:"
echo "  User: $USER_PARTY"
echo "  Admin: $ADMIN_PARTY"
echo "  OracleUpdater: $ORACLE_PARTY"
echo "  Liquidator: $LIQUIDATOR_PARTY"
echo "  InstitutionDemo: $INSTITUTION_DEMO_PARTY"
echo "✓ Navigator users prepared"
echo ""

echo "======================================"
echo "STEP 9: Starting Navigator"
echo "======================================"
daml navigator server localhost 5011 --port 7500 --feature-user-management false > navigator.log 2>&1 &
NAVIGATOR_PID=$!
echo "Navigator PID: $NAVIGATOR_PID"
sleep 5
echo "✓ Navigator started on port 7500"
echo ""

echo "======================================"
echo "ALL SERVICES STARTED SUCCESSFULLY!"
echo "======================================"
echo "✓ Sandbox PID: $SANDBOX_PID (Port 5011)"
echo "✓ JSON API PID: $JSON_API_PID (Port 7575)"
echo "✓ Backend PID: $BACKEND_PID (Port 4000)"
echo "✓ Oracle PID: $ORACLE_PID"
echo "✓ Frontend PID: $FRONTEND_PID (Port 3000)"
echo "✓ Navigator PID: $NAVIGATOR_PID (Port 7500)"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:4000"
echo "Navigator: http://localhost:7500"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $SANDBOX_PID $JSON_API_PID $BACKEND_PID $ORACLE_PID $FRONTEND_PID $NAVIGATOR_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
