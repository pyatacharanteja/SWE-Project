# Secure Anonymous Voting System

A robust and secure voting platform with cryptographic anonymity, blockchain verification, and fraud prevention mechanisms.

## Core Features

- **Anonymous Voting** - Vote securely without revealing your identity
- **Cryptography** - End-to-end encryption for vote data
- **Blockchain Integration** - Immutable vote records on Ethereum
- **Fraud Prevention** - Browser fingerprinting and rate limiting
- **CAPTCHA Protection** - Bot prevention using hCaptcha
- **Real-time Results** - Live vote counting and visualization

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT-based, Anonymous token system
- **Security**: Cryptographic operations, SHA-256, AES encryption
- **Blockchain**: Ethereum smart contracts (via ethers.js)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/secure-voting-system.git
   cd secure-voting-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (copy from .env.example):
   ```
   cp .env.example .env
   ```

4. Initialize the database:
   ```
   npx prisma migrate dev
   ```

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security Architecture

### Vote Anonymity

- One-time tokens issued for each voter
- No linkage between voter identity and vote content
- Cryptographic encryption of vote data

### Fraud Prevention Techniques

- IP address rate limiting
- Browser fingerprinting to detect duplicate voting attempts
- CAPTCHA verification for human validation
- Token validation and expiration

### Blockchain Integration

- Vote records stored on Ethereum blockchain
- Immutable proof of vote submission
- Public verification without compromising privacy

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│   Web Frontend  │◄────►│  Next.js API    │◄────►│  Database       │
│   (Next.js)     │      │  Routes         │      │  (Prisma/SQLite)│
│                 │      │                 │      │                 │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │                 │
                         │  Blockchain     │
                         │  (Ethereum)     │
                         │                 │
                         └─────────────────┘
```

## API Endpoints

### Authentication
- `POST /api/auth` - Login with email/password
- `DELETE /api/auth` - Logout
- `GET /api/auth` - Check authentication status

### Polls 
- `GET /api/polls` - List all polls (admin only)
- `POST /api/polls` - Create a new poll with options
- `GET /api/polls/:id` - Get specific poll details
- `PUT /api/polls/:id` - Update poll (admin only)
- `DELETE /api/polls/:id` - Delete poll (admin only)
- `GET /api/polls/:id/results` - Get poll results

### Voting
- `POST /api/vote` - Submit a vote using an anonymous token

## License

MIT License

## Contact

Your Name - your.email@example.com
