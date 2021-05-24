/*
  Warnings:

  - Made the column `ship_address` on table `order_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ship_postal_code` on table `order_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_date` on table `order_request` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "order_request" ALTER COLUMN "ship_address" SET NOT NULL,
ALTER COLUMN "ship_postal_code" SET NOT NULL,
ALTER COLUMN "order_date" SET NOT NULL;
