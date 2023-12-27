-- CreateTable
CREATE TABLE "CustomerVerifyToken" (
    "customerId" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVerifyToken_customerId_key" ON "CustomerVerifyToken"("customerId");

-- AddForeignKey
ALTER TABLE "CustomerVerifyToken" ADD CONSTRAINT "CustomerVerifyToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
