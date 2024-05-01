/*
  Warnings:

  - Added the required column `estimated_sum` to the `damage_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "damage_reports" ADD COLUMN     "estimated_sum" DECIMAL(10,2) NOT NULL;
