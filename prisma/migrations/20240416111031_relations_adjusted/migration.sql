/*
  Warnings:

  - A unique constraint covering the columns `[leasing_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `parking_locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `vehicle_classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invoices_leasing_id_key" ON "invoices"("leasing_id");

-- CreateIndex
CREATE UNIQUE INDEX "parking_locations_address_key" ON "parking_locations"("address");

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoice_id_key" ON "payments"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_classes_title_key" ON "vehicle_classes"("title");
