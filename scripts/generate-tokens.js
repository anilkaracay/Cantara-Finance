const jwt = require('jsonwebtoken');

const LEDGER_ID = "sandbox"; // Actual Ledger ID reported by error
const SECRET = "unsafe"; // Default for daml start

const parties = {
    "Admin": "party-fe20028c-6b66-446a-b4e1-725d33a5d8f0::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0",
    "User": "party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0",
    "OracleUpdater": "party-f14fa3d7-0cfd-4a77-80de-4e11d4f5a581::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0",
    "Liquidator": "party-75d981aa-f5bd-448d-a836-572b06762e37::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0"
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
