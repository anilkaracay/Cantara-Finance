const jwt = require('jsonwebtoken');

const SECRET = "unsafe"; // Must match canton_simple.conf
const LEDGER_ID = "sandbox"; // Default Canton ledger ID
const APP_ID = "cantara-backend";

// Generate admin token
const adminPayload = {
    "https://daml.com/ledger-api": {
        "ledgerId": LEDGER_ID,
        "applicationId": APP_ID,
        "actAs": ["Admin"],
        "readAs": ["Admin"]
    }
};

const adminToken = jwt.sign(adminPayload, SECRET, { algorithm: 'HS256' });

// Generate user token  
const userPayload = {
    "https://daml.com/ledger-api": {
        "ledgerId": LEDGER_ID,
        "applicationId": APP_ID,
        "actAs": ["User"],
        "readAs": ["User"]
    }
};

const userToken = jwt.sign(userPayload, SECRET, { algorithm: 'HS256' });

// Generate oracle token
const oraclePayload = {
    "https://daml.com/ledger-api": {
        "ledgerId": LEDGER_ID,
        "applicationId": APP_ID,
        "actAs": ["Oracle"],
        "readAs": ["Oracle"]
    }
};

const oracleToken = jwt.sign(oraclePayload, SECRET, { algorithm: 'HS256' });

// Generate liquidator token
const liquidatorPayload = {
    "https://daml.com/ledger-api": {
        "ledgerId": LEDGER_ID,
        "applicationId": APP_ID,
        "actAs": ["Liquidator"],
        "readAs": ["Liquidator"]
    }
};

const liquidatorToken = jwt.sign(liquidatorPayload, SECRET, { algorithm: 'HS256' });

console.log("# DAML Config - Add these to your .env file");
console.log("CANTARA_DAML_BASE_URL=http://localhost:7575");
console.log(`CANTARA_DAML_LEDGER_ID=${LEDGER_ID}`);
console.log(`CANTARA_DAML_ADMIN_TOKEN=${adminToken}`);
console.log(`CANTARA_DAML_USER_TOKEN=${userToken}`);
console.log(`CANTARA_DAML_ORACLE_TOKEN=${oracleToken}`);
console.log(`CANTARA_DAML_LIQUIDATOR_TOKEN=${liquidatorToken}`);
