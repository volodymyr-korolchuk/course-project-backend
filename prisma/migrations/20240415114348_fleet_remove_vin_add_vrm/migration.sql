/*
  Warnings:

  - You are about to drop the column `vin` on the `fleet` table. All the data in the column will be lost.
  - Added the required column `vrm` to the `fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fleet" DROP COLUMN "vin",
ADD COLUMN     "vrm" VARCHAR(8) NOT NULL;
