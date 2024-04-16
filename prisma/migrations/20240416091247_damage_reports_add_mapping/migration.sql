/*
  Warnings:

  - You are about to drop the `DamageReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DamageReport" DROP CONSTRAINT "DamageReport_vehicle_id_fkey";

-- DropTable
DROP TABLE "DamageReport";

-- CreateTable
CREATE TABLE "damage_reports" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "description" VARCHAR(4096) NOT NULL,

    CONSTRAINT "damage_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
