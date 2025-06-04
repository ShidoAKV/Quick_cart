/*
  Warnings:

  - A unique constraint covering the columns `[PaymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refundId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Order_PaymentId_key" ON "Order"("PaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_refundId_key" ON "Order"("refundId");
