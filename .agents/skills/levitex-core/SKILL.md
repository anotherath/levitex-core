---
name: Levitex Core Protocol
description: Specialized domain skill for building the Levitex Decentralized Exchange (DEX). Focuses on Web3 integration, trading logic, and high-performance financial UI.
---

# Levitex Core Protocol

This skill guides the development of the Levitex DEX, ensuring a secure, performant, and premium decentralized trading experience.

## 🏗️ Technical Stack & Architecture
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Web3 Layer**: Viem + Wagmi + TanStack Query (industry standard for Ethereum-based chains).
- **Styling**: Tailwind CSS + Framer Motion (premium animations).
- **Backend Logic**: Next.js Server Actions for off-chain data and caching.

## 💱 Core DEX Domain Knowledge
### 1. Web3 Integration Patterns
- **Provider Management**: Centralized `Web3Provider` using Wagmi/RainbowKit.
- **Contract Hooks**: Creation of custom hooks (e.g., `useLevitexContract`) for consistent interaction.
- **Transaction Flow**: Always implement `Pending` -> `Success` -> `Error` states with toast notifications.

### 2. Trading Logic
- **Price Feeds**: Integration with Chainlink Oracles or Pyth Network.
- **Slippage & Fees**: Centralized calculation logic to ensure FE and BE consistency.
- **Order Execution**: Patterns for handling AMM swaps or Limit Order signatures (EIP-712).

### 3. UI/UX Excellence (DEX Specific)
- **Trading Charts**: Integration with Lightweight Charts or TradingView.
- **Real-time Data**: Use of SWR or TanStack Query with polling/WebSocket for price updates and order books.
- **Transaction Simulation**: Integrate Tenderly or similar APIs to show "Impact of Trade" before execution.

## 🔒 Security First
- **Input Validation**: Never trust client-side numbers for contract calls (always use BigInt).
- **Network Guards**: Ensure user is on the correct Chain ID before allowing transactions.
- **Reentrancy & Front-running**: Code defensively against MEV (Maximal Extractable Value).

## 🧩 Component Standards
- **`TokenIcon`**: Standardized component for fetching and displaying token logos.
- **`BalanceDisplay`**: Handles bigint formatting with custom precision.
- **`ConnectButton`**: Custom-styled button following Levitex's premium dark aesthetic.

## 🎨 Tailwind CSS v4 Variable Best Practices
Tailwind v4 introduces a shorthand for CSS variables, but it must be used carefully:

### 1. Variables in Utilities
- **Colors & Opacity**: Use the new shorthand for simple colors (e.g., `text-(--text-primary)`, `border-(--accent-violet)`).
- **Gradients (Crucial)**: **NEVER** use shorthand for gradients in `bg-`.
  - ❌ Incorrect: `bg-(--gradient-button)` (Tailwind interprets this as `background-color`, which fails for gradients).
  - ✅ Correct: `bg-[var(--gradient-button)]` or `bg-linear-to-r from-(--color-1) to-(--color-2)`.
- **Arbitrary Values**: If a variable is used inside an arbitrary value, use the full `var()` syntax (e.g., `shadow-[0_4px_16px_var(--shadow-color)]`).

### 2. Consistency
- When a component uses multiple variables (background, text, border), prioritize the **explicit `[var(--var)]` syntax** if any variable contains a complex value (like a gradient) to ensure visual stability and avoid unexpected `background-color` overrides.

## 📂 Directory Organization
```text
src/
├── actions/        # Server Actions (BE logic)
├── components/     # UI
│   ├── trade/      # Swap, Limit, Orderbook
│   ├── wallet/     # Connect, Account, Balances
│   └── shared/     # Buttons, Modals, Toasts
├── hooks/          # useSwap, useContract, useBalance
├── lib/            # viem-client, abi-definitions, utils
└── providers/      # Web3Provider, ThemeProvider
```
