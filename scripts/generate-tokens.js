const jwt = require('jsonwebtoken');

const LEDGER_ID = "sandbox"; // Actual Ledger ID reported by error
const SECRET = "unsafe"; // Default for daml start

const parties = {
    "Admin": "Admin::1220f3e212596ffe1d16e2bcb9ad357e8f9fa91d1963f5af0a3da11ccbd6de1d1005",
    "User": "User::1220f3e212596ffe1d16e2bcb9ad357e8f9fa91d1963f5af0a3da11ccbd6de1d1005",
    "OracleUpdater": "OracleUpdater::1220f3e212596ffe1d16e2bcb9ad357e8f9fa91d1963f5af0a3da11ccbd6de1d1005",
    "Liquidator": "Liquidator::1220f3e212596ffe1d16e2bcb9ad357e8f9fa91d1963f5af0a3da11ccbd6de1d1005"
};

function generateToken(partyId) {
    const payload = {
        "https://daml.com/ledger-api": {
            "ledgerId": LEDGER_ID,
            "applicationId": "cantara-backend",
            "actAs": [partyId],
            "readAs": [partyId]
        }
    };
    return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}

console.log("CANTARA_DAML_ADMIN_TOKEN=" + generateToken(parties.Admin));
console.log("CANTARA_DAML_USER_TOKEN=" + generateToken(parties.User));
console.log("CANTARA_DAML_ORACLE_TOKEN=" + generateToken(parties.OracleUpdater));
console.log("CANTARA_DAML_LIQUIDATOR_TOKEN=" + generateToken(parties.Liquidator));
