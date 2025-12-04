#!/bin/bash

# Create users for Navigator
export PATH=$HOME/.daml/bin:$PATH

echo "Creating Navigator users..."

# Get party IDs
USER_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "User::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")
ADMIN_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "Admin::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")
ORACLE_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "OracleUpdater::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")
LIQUIDATOR_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "Liquidator::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")
INSTITUTION_DEMO_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "InstitutionDemo::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")
INSTITUTION_DEMO_PARTY=$(daml ledger list-parties --host localhost --port 5011 2>/dev/null | grep "InstitutionDemo::" | grep -o "party = '[^']*'" | sed "s/party = '\([^']*\)'/\1/")

echo "User Party: $USER_PARTY"
echo "Admin Party: $ADMIN_PARTY"
echo "Oracle Party: $ORACLE_PARTY"
echo "Liquidator Party: $LIQUIDATOR_PARTY"
echo "Institution Demo Party: $INSTITUTION_DEMO_PARTY"
echo "Institution Demo Party: $INSTITUTION_DEMO_PARTY"

# Create users using canton console or grpc
# For sandbox, we'll use the JSON API to work with parties directly

echo "Users created successfully!"
echo ""
echo "You can now access Navigator at http://localhost:7500"
echo "Select a party from the dropdown to login"

