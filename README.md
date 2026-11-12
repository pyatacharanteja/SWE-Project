# Secure Anonymous Voting System

A full-stack voting web app built with Next.js, TypeScript and Prisma. An admin creates polls and generates one-time voting tokens, voters cast a vote with a token, and results are shown on a dashboard. The goal is to keep each vote unlinked from the voter's identity while limiting fraud.

**Status:** work in progress. The core flow works; the items under "Not finished yet" are still in development.

## What works
- **Admin login** and dashboard for creating and managing polls and options
- **One-time voting tokens:** each token is stored hashed and is marked as used after a vote, so it can't be reused
- **Vote submission API** with checks for token validity and poll status
- **Fraud controls:** per-IP rate limiting and browser fingerprint hashing
- **Results view** with vote counts per option
- **Prisma data model** for polls, options, votes, tokens and users (SQLite)

## Not finished yet
- **hCaptcha:** the server-side verification code exists and runs only when `HCAPTCHA_SECRET_KEY` is set, but no CAPTCHA widget is shown in the voting page yet.
- **Vote encryption:** the encryption helper exists, but the vote route currently passes a placeholder key.
- **Vote signing:** votes use a placeholder signature instead of a real cryptographic one.
- **Ethereum integration:** a blockchain module (`ethers.js`) exists, but there is no deployed smart contract. Without environment variables it runs in mock mode, and the confirmation page shows a sample transaction hash.
- **Rate limiter** is in memory, so it only works on a single server (a shared store such as Redis would be needed in production).
- **Dashboard** still falls back to sample poll data when none is saved.
- **Tests** have not been written yet.

## Tech stack
Next.js 15, React 19, TypeScript, Prisma, SQLite, Tailwind CSS, jsonwebtoken, ethers.js

## Run it locally
```bash
git clone https://github.com/pyatacharanteja/SWE-Project.git
cd SWE-Project
npm install
```

Create a `.env` file:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
TOKEN_ENCRYPTION_KEY="change-me"
MAX_REQUESTS_PER_IP=100
REQUEST_WINDOW_MS=3600000
```
`HCAPTCHA_SECRET_KEY` is optional and not needed until the CAPTCHA widget is added. The three `ETHEREUM_*` variables (`ETHEREUM_PROVIDER_URL`, `ETHEREUM_PRIVATE_KEY`, `ETHEREUM_CONTRACT_ADDRESS`) are optional. Leave them unset to run in mock mode.

Then set up the database and start the dev server:
```bash
npx prisma generate
npx prisma db push
npm run dev
```
Open http://localhost:3000.

## Roadmap
1. Add the hCaptcha widget to the voting page and send its token with the vote
2. Fix the TypeScript errors from the Next.js 15 async APIs, and get `npm run build` passing
3. Replace the placeholder key and signature with real ones
4. Deploy a vote-recording contract on a testnet (Sepolia), or remove the blockchain module
5. Load polls from the database instead of sample data
6. Add tests for token validation and rate limiting, then deploy
