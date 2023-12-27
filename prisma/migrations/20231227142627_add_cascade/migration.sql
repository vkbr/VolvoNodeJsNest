-- DropForeignKey
ALTER TABLE "CustomerRoles" DROP CONSTRAINT "CustomerRoles_customerId_fkey";

-- DropForeignKey
ALTER TABLE "TokenInfo" DROP CONSTRAINT "TokenInfo_customerId_fkey";

-- AddForeignKey
ALTER TABLE "CustomerRoles" ADD CONSTRAINT "CustomerRoles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfo" ADD CONSTRAINT "TokenInfo_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
