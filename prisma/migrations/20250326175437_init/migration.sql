-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pollId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "encryptedVote" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "blockchainTx" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenId" TEXT,
    "fingerprint" TEXT,
    CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pollId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "ipHash" TEXT,
    CONSTRAINT "Token_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
