/*
  Warnings:

  - Added the required column `amount` to the `order_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_details" ADD COLUMN     "amount" INTEGER NOT NULL;
