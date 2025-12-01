const axios = require('axios');

const BACKEND_URL = 'http://localhost:4000';
const USER_PARTY_HEADER = 'party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0'; // Replace with actual user party if needed, or fetch dynamically
// Actually, let's use the one from previous logs or `scripts/generate-tokens.js` output if possible.
// But for now I'll use the one I saw in the curl command earlier.
// "x-cantara-user: party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0"

const headers = {
    'x-cantara-user': USER_PARTY_HEADER,
    'Content-Type': 'application/json'
};

async function main() {
    try {
        console.log("1. Depositing ETH...");
        await axios.post(`${BACKEND_URL}/positions/deposit`, {
            asset: "ETH",
            amount: 10
        }, { headers });
        console.log("Deposited 10 ETH");

        console.log("2. Borrowing USDC...");
        // ETH price approx 3000? 10 ETH = 30k. Max LTV 80%? = 24k.
        // Let's borrow 20k USDC.
        await axios.post(`${BACKEND_URL}/positions/borrow`, {
            asset: "USDC",
            amount: 20000
        }, { headers });
        console.log("Borrowed 20000 USDC");

        console.log("3. Dropping ETH Price...");
        // Drop ETH to 2000. 10 ETH = 20k. Debt = 20k. HF < 1.0 (likely, depending on liquidation threshold).
        // Liquidation Threshold usually > LTV. Say 85%.
        // 20k * 0.85 = 17k borrowing power at threshold.
        // Debt 20k > 17k. Liquidatable.

        // Admin endpoint for price update
        await axios.post(`${BACKEND_URL}/admin/oracle/price`, {
            symbol: "ETH",
            price: "2000.0"
        }, { headers }); // Admin might need different auth?
        // backend/src/routes/admin.ts doesn't seem to check specific admin role in the code I saw, 
        // or it uses `userIdentityPlugin`.
        // Let's try.
        console.log("Dropped ETH price to 2000");

    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

main();
