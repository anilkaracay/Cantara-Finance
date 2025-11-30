const jwt = require('jsonwebtoken');

const LEDGER_ID = "sandbox"; // Actual Ledger ID reported by error
const SECRET = "secret"; // Default for daml start

const parties = {
    "Admin": "party-b30b2ad5-8f9b-4329-ba28-a931f6de2778::122070dd5d4c98499ae2f2c890d416de24190a13b44f3aeb60a3e9d18f60a852baff",
    "User": "party-5bd0e7df-bdbd-4f32-8ab3-3637192dc9b3::122070dd5d4c98499ae2f2c890d416de24190a13b44f3aeb60a3e9d18f60a852baff",
    "OracleUpdater": "party-34c0f474-0025-4a99-a458-9314cc0c7099::122070dd5d4c98499ae2f2c890d416de24190a13b44f3aeb60a3e9d18f60a852baff",
    "Liquidator": "party-2096fbf7-3aee-4191-b3da-6a23d67f5d41::122070dd5d4c98499ae2f2c890d416de24190a13b44f3aeb60a3e9d18f60a852baff"
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
