-- CreateEnum
CREATE TYPE "CustomerRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CustomerRoles" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "role" "CustomerRole" NOT NULL,

    CONSTRAINT "CustomerRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenInfo" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAfter" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRoles_id_key" ON "CustomerRoles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRoles_customerId_key" ON "CustomerRoles"("customerId");

-- AddForeignKey
ALTER TABLE "CustomerRoles" ADD CONSTRAINT "CustomerRoles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfo" ADD CONSTRAINT "TokenInfo_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
