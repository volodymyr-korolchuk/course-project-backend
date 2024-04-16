/*
  Warnings:

  - You are about to drop the column `user_id` on the `customers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_user_id_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "user_id";
