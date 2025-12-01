const axios = require('axios');

const LEDGER_URL = 'http://localhost:7575';
// Token for User from start_backend.sh or generate-tokens.js
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImNhbnRhcmEtYmFja2VuZCIsImFjdEFzIjpbInBhcnR5LTk0ZDVmMWZhLTJkZDktNDEwNy1iMWViLWJlODBjZGVlMjZkYjo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXSwicmVhZEFzIjpbInBhcnR5LTk0ZDVmMWZhLTJkZDktNDEwNy1iMWViLWJlODBjZGVlMjZkYjo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXX0sImlhdCI6MTc2NDU3NTM4OX0.Y8NHrrN2eY8bd6T4OWwnnpCCRrY5He6h-DsBJt6UTgk";
const USER_PARTY = "party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0";
const PACKAGE_ID = "57cbc52c6ee5b0f7f3eeda7c25c90062b33ce10067d566eeaa934ab51681c7d9";
const MODULE_NAME = "Cantara.Wallet";
const TEMPLATE_NAME = "AssetHolding";
const TEMPLATE_ID = `${PACKAGE_ID}:${MODULE_NAME}:${TEMPLATE_NAME}`;

const ASSETS = ["ETH", "BTC", "USDC", "USTB", "PAXG", "CC"];
const AMOUNT = "1000.0";

async function mintCoins() {
    console.log(`Minting ${AMOUNT} of each asset for user ${USER_PARTY}...`);
    console.log(`Template ID: ${TEMPLATE_ID}`);

    for (const symbol of ASSETS) {
        try {
            const payload = {
                templateId: TEMPLATE_ID,
                payload: {
                    owner: USER_PARTY,
                    symbol: symbol,
                    amount: AMOUNT
                }
            };

            const response = await axios.post(`${LEDGER_URL}/v1/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${USER_TOKEN}`
                }
            });

            if (response.status === 200) {
                console.log(`✅ Minted ${AMOUNT} ${symbol}`);
            } else {
                console.error(`❌ Failed to mint ${symbol}: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error(`❌ Error minting ${symbol}:`, error.response ? error.response.data : error.message);
        }
    }
}

mintCoins();
