# PasaCoin Backend

A comprehensive backend system for managing rotating rounds (rondas rotativas) with smart contract integration, built with NestJS and TypeScript.

## 🚀 Project Overview

PasaCoin Backend is a blockchain-enabled application that manages rotating rounds where participants contribute funds and receive payouts in sequence. The system combines traditional backend services with smart contract functionality for transparent and secure financial operations.

## 🏗️ Architecture

The project consists of two main components:

### 1. Backend API (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: User management with wallet integration
- **API Documentation**: Swagger/OpenAPI
- **Modules**:
  - Users Management
  - Round Management
  - Reputation System
  - Participation Tracking

### 2. Smart Contracts (Solidity)
- **Platform**: Monad Testnet (Chain ID: 10143)
- **Main Contract**: PasaCoin.sol - Manages rotating rounds
- **Features**: ERC20 token integration, round creation, payment processing
- **Verified Contracts**:
  - **PasaCoin**: [0x4e5d585ef8696aD9894fC0Ea26d920e42548a6fF](https://testnet.monadexplorer.com/address/0x4e5d585ef8696aD9894fC0Ea26d920e42548a6fF?portfolio=Info&tab=Contract) - Verified on Monad Testnet Explorer


## ✨ Features

- **User Management**: Registration, authentication, and profile management
- **Round Creation**: Public and private rotating rounds
- **Payment Processing**: Automated payment distribution
- **Reputation System**: Track user participation and reliability
- **Smart Contract Integration**: Blockchain-based round management
- **API Documentation**: Comprehensive Swagger documentation
- **Database Management**: PostgreSQL with TypeORM

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database
- **Swagger** - API documentation
- **bcrypt** - Password hashing
- **ethers** - Ethereum library integration

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **Ethereum** - Blockchain platform

## 📁 Project Structure

```
pasacoin-backend/
├── back/                          # NestJS Backend
│   ├── src/
│   │   ├── users/                # User management
│   │   ├── rounder/              # Round management
│   │   ├── reputation/           # Reputation system
│   │   ├── entities/             # Database entities
│   │   ├── config/               # Configuration files
│   │   └── middlewares/          # Global middlewares
│   ├── package.json
│   └── README.md
├── smartContract/                 # Smart Contract Code
│   ├── contracts/
│   │   ├── PasaCoin.sol         # Main contract
│   │   └── Lock.sol             # Lock contract
│   ├── hardhat.config.ts
│   └── package.json
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd back
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `back/` directory with:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=pasacoin_db
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application:**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

### Smart Contract Setup

1. **Navigate to the smart contract directory:**
   ```bash
   cd smartContract
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile contracts:**
   ```bash
   npx hardhat compile
   ```

4. **Run tests:**
   ```bash
   npx hardhat test
   ```

## 📚 API Endpoints

The backend provides RESTful APIs for:

- **Users**: Registration, authentication, profile management
- **Rounds**: Creation, joining, status tracking
- **Reputation**: User reliability scoring
- **Participation**: Round participation tracking

Access the Swagger documentation at: `http://localhost:3000/api`

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Smart Contract Tests
```bash
npx hardhat test
```

## 🔧 Development

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Available Scripts
```bash
# Backend
npm run build          # Build the application
npm run start:dev      # Start in development mode
npm run start:debug    # Start in debug mode
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Smart Contracts
npx hardhat compile    # Compile contracts
npx hardhat test      # Run tests
npx hardhat deploy    # Deploy contracts
```

## 🌐 Deployment

### Backend Deployment
The NestJS application can be deployed using:
- Traditional hosting platforms
- Docker containers
- Cloud platforms (AWS, GCP, Azure)

### Smart Contract Deployment
Deploy to various networks using Hardhat:
```bash
npx hardhat run scripts/deploy.js --network <network_name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the smart contract code
- Open an issue on GitHub

## 🔗 Related Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 📋 Verified Smart Contracts

The following smart contracts are deployed and verified on the **Monad Testnet**:

### PasaCoin Contract
- **Address**: [0x4e5d585ef8696aD9894fC0Ea26d920e42548a6fF](https://testnet.monadexplorer.com/address/0x4e5d585ef8696aD9894fC0Ea26d920e42548a6fF?portfolio=Info&tab=Contract)
- **Network**: Monad Testnet (Chain ID: 10143)
- **Explorer**: [Monad Testnet Explorer](https://testnet.monadexplorer.com)
- **Status**: ✅ Verified
- **Purpose**: Main contract for managing rotating rounds with ERC20 token integration

### Token Information
- **USDM Token**: 0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D
- **Network**: Monad Testnet
- **Purpose**: ERC20 token used for round payments and distributions

---

**Built with ❤️ using NestJS and Solidity**