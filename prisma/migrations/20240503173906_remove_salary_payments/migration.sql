/*
  Warnings:

  - You are about to drop the column `salaries_paid` on the `monthly_analytics` table. All the data in the column will be lost.
  - You are about to drop the `salary_payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "salary_payments" DROP CONSTRAINT "salary_payments_employee_id_fkey";

-- AlterTable
ALTER TABLE "monthly_analytics" DROP COLUMN "salaries_paid";

-- DropTable
DROP TABLE "salary_payments";
