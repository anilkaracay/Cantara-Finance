const crypto = require('crypto');

function base64url(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const header = {
    "alg": "HS256",
    "typ": "JWT"
};

const payload = {
    "https://daml.com/ledger-api": {
        "ledgerId": "participant1",
        "applicationId": "cantara-backend",
        "actAs": ["Admin::122090d8b2699d1e38462cd1dcbe40777807e09c84c774d03ae99fe6af89fc243cc4"],
        "readAs": ["Admin::122090d8b2699d1e38462cd1dcbe40777807e09c84c774d03ae99fe6af89fc243cc4"]
    },
    "iat": Math.floor(Date.now() / 1000)
};

const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));

const secret = "secret"; // Default sandbox secret?
const signature = crypto.createHmac('sha256', secret)
    .update(encodedHeader + "." + encodedPayload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const token = `${encodedHeader}.${encodedPayload}.${signature}`;
console.log(token);
