/*
  Warnings:

  - You are about to alter the column `phone_number` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(32)` to `VarChar(16)`.
  - You are about to drop the column `position_id` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the `positions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_position_id_fkey";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(16);

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "position_id";

-- DropTable
DROP TABLE "positions";
