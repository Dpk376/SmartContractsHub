# ⛓️ Blockchain-main: Advanced Smart Contract Suite

[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-blue?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Development_Environment-yellow?style=for-the-badge&logo=hardhat)](https://hardhat.org/)


A professionally organized collection of smart contracts implementing various DeFi, Governance, and Supply Chain protocols. 

## 🏗️ Project Structure

The repository has been restructured to follow industry standards for scalable blockchain applications:

```bash
Blockchain-main/
├── contracts/          # Core Solidity smart contracts
│   ├── Auction.sol     # Secure Pull-Payment Auction protocol
│   ├── Voting.sol      # Advanced Governance with Quorum & Voting Rights
│   ├── Lending.sol     # DeFi Lending & Borrowing implementation
│   └── ...             # 20+ specialized contracts (Supply Chain, Identity, etc.)
├── test/               # Ethers.js and Hardhat test suites
├── docs/               # Research notes, technical specifications, and Daml analysis
├── scripts/            # Deployment and automation scripts
└── hardhat.config.js   # Hardhat development environment setup
```

## 🔥 Key Features & Optimizations

- **Security First**: Key contracts like `Auction.sol` implement the **Withdrawal Pattern** (Pull over Push) to prevent Denial of Service (DoS) attacks and ensure secure fund transfers.
- **Modern Standards**: All core contracts have been modernized to **Solidity 0.8.20**, utilizing custom errors for gas reduction and `block.timestamp` for timing.
- **Access Control**: Integrated **OpenZeppelin's `Ownable`** and `access control` patterns to manage administrative privileges securely.
- **Gas Efficiency**: Optimized state updates and used `immutable`/`constant` variables to minimize on-chain execution costs.
- **Broad Protocol Support**: Implements complex logic for Real Estate, Insurance, Digital Identity, and IoT Supply Chain on-chain.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dpk376/Blockchain.git
   cd Blockchain-main
   ```
2. Install dependencies (Hardhat & OpenZeppelin):
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
   ```

### Development
- **Compile Contracts**:
  ```bash
  npx hardhat compile
  ```
- **Run Tests**:
  ```bash
  npx hardhat test
  ```


*Developed with a focus on Security, Optimization, and Transparency by Dpk376*
