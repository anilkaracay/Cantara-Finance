const jwt = require('jsonwebtoken');

const LEDGER_ID = "sandbox"; // Actual Ledger ID reported by error
const SECRET = "secret"; // Default for daml start

const parties = {
    "Admin": "party-a7a7ec95-e3af-4a6d-892e-24ed2787cbae::1220807569290271efb63c784b0675e098763942200df2836a3a309c8c546445fe87",
    "User": "party-1f4180b0-b07f-41e7-9e89-04a0aa955846::1220807569290271efb63c784b0675e098763942200df2836a3a309c8c546445fe87",
    "OracleUpdater": "party-cdb629ad-6064-469e-97cf-c0b847c68644::1220807569290271efb63c784b0675e098763942200df2836a3a309c8c546445fe87",
    "Liquidator": "party-115aa04c-7927-43e5-8b20-b5cb3b8931d5::1220807569290271efb63c784b0675e098763942200df2836a3a309c8c546445fe87"
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
