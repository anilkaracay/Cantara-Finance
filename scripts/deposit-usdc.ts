// import fetch from "node-fetch"; // Use native fetch in Node 18+

const BACKEND_URL = "http://localhost:4000";
const PARTY_ID = "party-94d5f1fa-2dd9-4107-b1eb-be80cdee26db::1220e319d78e8b39334bceab832669f08ac7ca54eed77a9ceabd17907e317d0c67f0";

async function main() {
    console.log("Starting deposit simulation...");

    const headers = {
        "Content-Type": "application/json",
        "x-cantara-user": PARTY_ID
    };

    // 1. Get Portfolio
    console.log("Fetching portfolio...");
    const portfolioRes = await fetch(`${BACKEND_URL}/portfolio`, { headers });
    const portfolio = await portfolioRes.json();
    if (!portfolio || !portfolio.contractId) {
        console.error("Failed to get portfolio", portfolio);
        return;
    }
    const portfolioCid = portfolio.contractId;
    console.log("Portfolio CID:", portfolioCid);

    // 2. Get Wallet Assets
    console.log("Fetching wallet assets...");
    const walletRes = await fetch(`${BACKEND_URL}/portfolio/wallet`, { headers });
    const wallet = await walletRes.json();
    const usdcAsset = wallet.find((a: any) => a.symbol === "USDC");
    if (!usdcAsset) {
        console.error("No USDC in wallet");
        return;
    }
    const assetCid = usdcAsset.contractId;
    console.log("USDC Asset CID:", assetCid);

    // 3. Get Pools
    console.log("Fetching pools...");
    const poolsRes = await fetch(`${BACKEND_URL}/pools/permissionless`, { headers });
    const pools = await poolsRes.json();
    const usdcPool = pools.find((p: any) => p.assetSymbol === "USDC");
    if (!usdcPool) {
        console.error("No USDC pool found");
        return;
    }
    const poolCid = usdcPool.contractId;
    console.log("USDC Pool CID:", poolCid);

    // 4. Deposit
    console.log("Depositing 1000 USDC...");
    const depositRes = await fetch(`${BACKEND_URL}/portfolio/deposit`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            portfolioCid,
            assetCid,
            poolCid,
            amount: "1000.0"
        })
    });

    if (depositRes.ok) {
        console.log("Deposit successful!");
    } else {
        console.error("Deposit failed", await depositRes.text());
    }
}

main().catch(console.error);
