/*
  Warnings:

  - Added the required column `role` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "role" VARCHAR(8) NOT NULL;
