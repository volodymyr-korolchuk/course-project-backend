/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(64) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "hashed_password" VARCHAR(72) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" VARCHAR(128) NOT NULL,
    "last_name" VARCHAR(128) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" VARCHAR(128) NOT NULL,
    "last_name" VARCHAR(128) NOT NULL,
    "patronymic" VARCHAR(128) NOT NULL,
    "position_id" INTEGER NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(64) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_payments" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "salary_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fleet" (
    "id" SERIAL NOT NULL,
    "make" VARCHAR(64) NOT NULL,
    "model" VARCHAR(64) NOT NULL,
    "production_year" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "vin" VARCHAR(17) NOT NULL,
    "parking_location_id" INTEGER NOT NULL,

    CONSTRAINT "fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_classes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "price_per_hour" DECIMAL(10,2) NOT NULL,
    "description" VARCHAR(4096) NOT NULL,

    CONSTRAINT "vehicle_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_locations" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "address" VARCHAR(256) NOT NULL,

    CONSTRAINT "parking_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leasings" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "created_by_employee_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "allowed_mileage" INTEGER NOT NULL,

    CONSTRAINT "leasings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "leasing_id" INTEGER NOT NULL,
    "amount_due" DECIMAL(10,2) NOT NULL,
    "insurance_amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(32) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_reports" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(4096) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "maintenance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finance_reports" (
    "id" SERIAL NOT NULL,
    "leasing_income" DECIMAL(10,2) NOT NULL,
    "taxes_paid" DECIMAL(10,2) NOT NULL,
    "fuel_expenses" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "finance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fleet" ADD CONSTRAINT "fleet_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "vehicle_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fleet" ADD CONSTRAINT "fleet_parking_location_id_fkey" FOREIGN KEY ("parking_location_id") REFERENCES "parking_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leasings" ADD CONSTRAINT "leasings_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leasings" ADD CONSTRAINT "leasings_created_by_employee_id_fkey" FOREIGN KEY ("created_by_employee_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leasings" ADD CONSTRAINT "leasings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_leasing_id_fkey" FOREIGN KEY ("leasing_id") REFERENCES "leasings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_reports" ADD CONSTRAINT "maintenance_reports_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
