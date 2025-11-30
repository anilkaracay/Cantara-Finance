# Cantara Finance

Cantara is a hybrid lending and borrowing protocol built on Canton Network.

## Structure

- `apps/frontend`: Next.js application (Landing Page, Dashboard).
- `apps/backend`: Node.js + Express REST API.
- `packages/daml-model`: DAML smart contracts.
- `packages/sdk`: TypeScript SDK for DAML interactions.
- `packages/utils`: Shared utilities.
- `packages/types`: Shared TypeScript types.

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build all packages:
   ```bash
   yarn turbo build
   ```

3. Run development server:
   ```bash
   yarn turbo dev
   ```

## Testing

- Run tests: `yarn turbo test`
- Lint: `yarn turbo lint`
