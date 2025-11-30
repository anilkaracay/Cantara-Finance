export const hubCardsInformations = [
  {
    title: "Government Bonds",
    permission: "Permissioned - KYC",
    apy: "4.7%",
    maxLtv: "65%",
    availableLiquidity: "$23.4M",
    collateral: "120 GBOND ($120k)",
    borrow: "USDC",
    healthFactor: 1.92,
  },
  {
    title: "Real Estate Fund",
    permission: "Permissioned - KYC",
    apy: "6.1%",
    maxLtv: "55%",
    availableLiquidity: "$8.2M",
    collateral: "$20k REIT",
    borrow: "USDC",
    healthFactor: 1.45,
  },
  {
    title: "USDC Stable Pool",
    permission: "Permissionless",
    apy: "3.2%",
    maxLtv: "75%",
    availableLiquidity: "$57.9M",
    collateral: "$5,000 USDC",
    borrow: "ETH / Stablecoin",
    healthFactor: 1.25,
  },
];

export const howCantaraWorksDatas = [
  {
    id: "1",
    title: "Connect & Choose Your Rail",
    description:
      "Connect your wallet and choose your transaction type. Use the permissionless rail for crypto-collateralized lending or switch to the permissioned rail to access institutional RWA pools after KYC/KYB verification.",
  },
  {
    id: "2",
    title: "Deposit Collateral",
    description:
      "Select the asset you want to use as collateral (crypto, treasury bond, fund) and deposit it into the smart contract. A pool receipt token is minted in return.",
  },
  {
    id: "3",
    title: "Borrow & Monitor",
    description:
      "Your Health Factor (HF) and LTV are instantly calculated. Borrow within your limit and track your position in real time on the dashboard with live metrics.",
  },
];

export const differencePartDatas = [
  {
    id: "1",
    title: "Feature",
    mainIcon: "okey",
    main: "CANTARA",
    mainDescription: "Precision Money Markets Platform",
    otherIcon: "notOkey",
    other: "Money markets",
    otherDescription: "Traditional Binary Markets",
  },
  {
    id: "2",
    title: "Architecture",
    mainIcon: "okey",
    main: "",
    mainDescription:
      "Dual-Rail design: permissionless + permissioned rails in one protocol.",
    otherIcon: "notOkey",
    other: "",
    otherDescription: "Single permissionless pools, no institutional access.",
  },
  {
    id: "3",
    title: "Collateral Types",
    mainIcon: "okey",
    main: "",
    mainDescription:
      "Crypto + RWA (MMFs, treasuries, bonds) priced via signed NAV oracles.",
    otherIcon: "notOkey",
    other: "",
    otherDescription:
      "Mostly volatile crypto assets, limited or no RWA support.",
  },
  {
    id: "4",
    title: "Privacy & Compliance",
    mainIcon: "okey",
    main: "",
    mainDescription:
      "Party-scoped privacy, KYC/KYB for institutional rails, regulator observer nodes.",
    otherIcon: "notOkey",
    other: "",
    otherDescription:
      "Fully public, no compliance layer, no regulator-friendly tooling.",
  },
  {
    id: "5",
    title: "Risk Management",
    mainIcon: "okey",
    main: "",
    mainDescription:
      "Health factor monitoring, partial liquidation, insurance vaults, tranche structure.",
    otherIcon: "notOkey",
    other: "",
    otherDescription:
      "Basic liquidation model, no insurance layers or structured risk.",
  },
  {
    id: "6",
    title: "Liquidity Efficiency",
    mainIcon: "okey",
    main: "",
    mainDescription: "Liquidity bridge between rails, optimized capital usage.",
    otherIcon: "notOkey",
    other: "",
    otherDescription: "Isolated liquidity, no cross-market flow.",
  },
];

export const CoreValuesDatas = [
  {
    id: "1",
    title: "Transparency",
    description:
      "On-chain audit logs and observer nodes provide full visibility into liquidity, utilization, and health factor metrics — for both users and regulators.",
  },
  {
    id: "2",
    title: "Privacy & Compliance",
    description:
      "Party-scoped data keeps sensitive positions private, while enabling KYC/KYB and regulator access where required.",
  },
  {
    id: "3",
    title: "Risk Management",
    description:
      "Partial liquidations, insurance vaults, and senior/junior tranches protect capital and minimize systemic risk.",
  },
  {
    id: "4",
    title: "Capital Efficiency",
    description:
      "Dual-rail liquidity bridge optimizes capital usage across permissionless and permissioned pools, unlocking deeper liquidity.",
  },
];

export const WhyCantaraDatas = [
  {
    id: "1",
    title: "Real Capital Support",
    description:
      "Cantara supports crypto and tokenized RWAs side by side, making it ideal for funds, treasuries, and real businesses. Not just degen yield farming.",
    image: "/images/realCapital/RealCapitalSupport.png",
  },
  {
    id: "2",
    title: "Open Yet Permissioned",
    description:
      "Everyone can participate permissionlessly, while institutions get a private, KYC/KYB-gated environment with NAV-based pricing.",
    image: "/images/realCapital/PermissionedAccess.png",
  },
  {
    id: "3",
    title: "Strong Risk Controls",
    description:
      "Health factor monitoring, partial liquidations, and insurance vaults ensure safer markets and lower contagion risk.",
    image: "/images/realCapital/RiskControl.png",
  },
  {
    id: "4",
    title: "Transparent & Auditable",
    description:
      "Observer nodes and audit logs give regulators and users full visibility into liquidity and risk metrics. No black boxes.",
    image: "/images/realCapital/TransparencyAuditable.png",
  },
];

export const faqDatas = [
  {
    question: "What makes Cantara different from other lending protocols?",
    answer:
      "Cantara combines permissionless DeFi rails with permissioned, KYC/KYB-gated RWA pools. This dual-rail design allows both retail users and institutions to coexist in one protocol, with transparency and compliance at its core.",
  },
  {
    question: "How do payouts and yields work?",
    answer:
      "Yields are generated from borrowing activity across both rails. In permissionless pools, interest accrues automatically like traditional DeFi. In permissioned pools, yields are tied to real-world assets (e.g., treasuries, funds) with NAV-based pricing.",
  },
  {
    question: "What kind of collateral can I use?",
    answer:
      "You can deposit crypto assets such as ETH and USDC, as well as tokenized RWAs including treasury bills, money market funds, real estate tokens, and more.",
  },
  {
    question: "How does Cantara handle risk?",
    answer:
      "Cantara uses health factor monitoring, partial liquidations, and insurance vaults to reduce contagion risk. Institutional pools follow stricter credit frameworks and regulatory-grade controls.",
  },
  {
    question: "What happens if my loan position drops in value?",
    answer:
      "If your health factor falls below the liquidation threshold, part of your collateral may be liquidated. Partial liquidation mechanisms are designed to minimize losses and protect your position.",
  },
  {
    question: "Who can access the permissioned pools?",
    answer:
      "Institutions, funds, and accredited investors that complete KYC/KYB verification gain access to permissioned pools with NAV-based yield products.",
  },
];
