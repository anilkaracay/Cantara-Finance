import axios from 'axios';

const LEDGER_URL = 'http://localhost:7575';

// Tokens from start_backend.sh
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImNhbnRhcmEtYmFja2VuZCIsImFjdEFzIjpbInBhcnR5LWZlMjAwMjhjLTZiNjYtNDQ2YS1iNGUxLTcyNWQzM2E1ZDhmMDo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXSwicmVhZEFzIjpbInBhcnR5LWZlMjAwMjhjLTZiNjYtNDQ2YS1iNGUxLTcyNWQzM2E1ZDhmMDo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXX0sImlhdCI6MTc2NDU3NTM4OX0.LKujMfBzMkRIU_YUWYWuveupkZQsfOtlzOgrld1AZN0";
const ORACLE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImNhbnRhcmEtYmFja2VuZCIsImFjdEFzIjpbInBhcnR5LWYxNGZhM2Q3LTBjZmQtNGE3Ny04MGRlLTRlMTFkNGY1YTU4MTo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXSwicmVhZEFzIjpbInBhcnR5LWYxNGZhM2Q3LTBjZmQtNGE3Ny04MGRlLTRlMTFkNGY1YTU4MTo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXX0sImlhdCI6MTc2NDU3NTM4OX0.YuXq0gDip1dx7X0HpOanq1kt1zHd_suvo4rNZMa1zKQ";
const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImNhbnRhcmEtYmFja2VuZCIsImFjdEFzIjpbInBhcnR5LTk0ZDVmMWZhLTJkZDktNDEwNy1iMWViLWJlODBjZGVlMjZkYjo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXSwicmVhZEFzIjpbInBhcnR5LTk0ZDVmMWZhLTJkZDktNDEwNy1iMWViLWJlODBjZGVlMjZkYjo6MTIyMGUzMTlkNzhlOGIzOTMzNGJjZWFiODMyNjY5ZjA4YWM3Y2E1NGVlZDc3YTljZWFiZDE3OTA3ZTMxN2QwYzY3ZjAiXX0sImlhdCI6MTc2NDU3NTM4OX0.Y8NHrrN2eY8bd6T4OWwnnpCCRrY5He6h-DsBJt6UTgk";

// Package ID from mint-coins.js (assuming it's stable for now)
const PACKAGE_ID = "57cbc52c6ee5b0f7f3eeda7c25c90062b33ce10067d566eeaa934ab51681c7d9";

const ASSETS = ["ETH", "BTC", "USDC", "USTB", "PAXG", "CC"];

async function getParty(token: string): Promise<string> {
    try {
        const response = await axios.get(`${LEDGER_URL}/v1/parties`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Return the first party in the list (usually the one the token acts as)
        if (response.data.result && response.data.result.length > 0) {
            return response.data.result[0].identifier;
        }
        throw new Error("No parties found for token");
    } catch (error: any) {
        console.error("Error fetching party:", error.message);
        throw error;
    }
}

async function createContract(token: string, templateId: string, payload: any) {
    try {
        await axios.post(`${LEDGER_URL}/v1/create`, {
            templateId,
            payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(`✅ Created ${templateId.split(':').pop()}`);
    } catch (error: any) {
        // Ignore if already exists (naive check) or log error
        console.log(`⚠️  Could not create ${templateId.split(':').pop()}: ${error.response?.data?.errors?.[0] || error.message}`);
    }
}

async function main() {
    console.log("🚀 Starting System Initialization...");

    try {
        const adminParty = await getParty(ADMIN_TOKEN);
        const oracleParty = await getParty(ORACLE_TOKEN);
        const userParty = await getParty(USER_TOKEN);

        console.log(`Admin: ${adminParty}`);
        console.log(`Oracle: ${oracleParty}`);
        console.log(`User: ${userParty}`);

        // 1. Create Pools (Admin)
        console.log("\n--- Creating Pools ---");
        for (const symbol of ASSETS) {
            const poolId = `${symbol}-POOL`;
            await createContract(ADMIN_TOKEN, `${PACKAGE_ID}:Cantara.Pool:LendingPool`, {
                admin: adminParty,
                observers: [userParty, oracleParty], // Make visible to user and oracle
                poolId: poolId,
                railType: "Permissionless",
                assetSymbol: symbol,
                assetClass: { tag: "Crypto", value: {} }, // Simple enum
                totalDeposits: "0.0",
                totalBorrows: "0.0",
                baseRate: "0.02",
                slope1: "0.04",
                slope2: "0.10",
                kinkUtilization: "0.80",
                riskParams: {
                    rpLtv: "0.80",
                    rpLiquidationThreshold: "0.85",
                    rpLiquidationPenalty: "0.05",
                    rpBorrowCap: "1000000.0",
                    rpSupplyCap: "1000000.0"
                },
                ownerInstitution: null,
                rwaReference: null,
                maturityDate: null,
                visibility: null
            });
        }

        // 2. Create Oracles (Oracle Party)
        console.log("\n--- Creating Oracles ---");
        for (const symbol of ASSETS) {
            await createContract(ORACLE_TOKEN, `${PACKAGE_ID}:Cantara.Oracle:OraclePrice`, {
                oracleUpdater: oracleParty,
                admin: adminParty,
                observers: [userParty], // Visible to user
                symbol: symbol,
                price: "1000.0", // Initial dummy price
                lastUpdatedAt: new Date().toISOString()
            });
        }

        // 3. Mint Assets (User)
        console.log("\n--- Minting Assets ---");
        for (const symbol of ASSETS) {
            await createContract(USER_TOKEN, `${PACKAGE_ID}:Cantara.Wallet:AssetHolding`, {
                owner: userParty,
                symbol: symbol,
                amount: "1000.0"
            });
        }

        console.log("\n✅ Initialization Complete!");

    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

main();
