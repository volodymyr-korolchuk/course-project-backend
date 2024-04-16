/*
  Warnings:

  - You are about to drop the column `end_date` on the `leasings` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `leasings` table. All the data in the column will be lost.
  - You are about to drop the `finance_reports` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `fleet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickup_date` to the `leasings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_date` to the `leasings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fleet" ADD COLUMN     "color" VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE "leasings" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "pickup_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "return_date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "finance_reports";

-- CreateTable
CREATE TABLE "DamageReport" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "description" VARCHAR(4096) NOT NULL,

    CONSTRAINT "DamageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_analytics" (
    "id" SERIAL NOT NULL,
    "leasings_income" DECIMAL(10,2) NOT NULL,
    "salaries_paid" DECIMAL(10,2) NOT NULL,
    "taxes_paid" DECIMAL(10,2) NOT NULL,
    "maintenance_expenses" DECIMAL(10,2) NOT NULL,
    "fuel_expenses" DECIMAL(10,2) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_analytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DamageReport" ADD CONSTRAINT "DamageReport_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
