const jwt = require('jsonwebtoken');

const secret = "secret"; // Default sandbox secret
const ledgerId = "sandbox";
const partyId = "Institution::122096f7120d5e326130cd11240ecc749a06953130535115c2bb51e0e754887784c3";

const payload = {
    "https://daml.com/ledger-api": {
        "ledgerId": ledgerId,
        "applicationId": "cantara-backend",
        "actAs": [partyId],
        "readAs": [partyId]
    }
};

const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
console.log(token);
