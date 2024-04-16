import { PrismaClient } from '@prisma/client';
import {
  generateCustomers,
  generateDamageReports,
  generateFleet,
  generateInvoices,
  generateLeasings,
  generateMaintenanceReports,
  generateParkingLocations,
  generatePayments,
  generatePositions,
  generateSalaryPayments,
  generateStaff,
  generateUsers,
  generateVehicleClasses,
  getRoles,
} from './seedingFunctions';

const prisma = new PrismaClient();

async function main() {
  const roles = getRoles();
  for (const role of roles) {
    await prisma.role.create({ data: { title: role } });
  }

  const users = await generateUsers(prisma, 20);
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  const customers = await generateCustomers(50);
  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }

  const positions = generatePositions();
  for (const position of positions) {
    await prisma.position.create({ data: { title: position } });
  }

  const staff = await generateStaff(prisma);
  for (const employee of staff) {
    await prisma.staff.create({ data: employee });
  }

  const salaryPayments = await generateSalaryPayments(prisma);
  for (const payment of salaryPayments) {
    await prisma.salaryPayment.create({ data: payment });
  }

  const parkingLocations = await generateParkingLocations(20);
  for (const location of parkingLocations) {
    await prisma.parkingLocation.create({
      data: {
        address: location,
      },
    });
  }

  const vehicleClasses = generateVehicleClasses();
  for (const vehicleClass of vehicleClasses) {
    await prisma.vehicleClass.create({
      data: vehicleClass,
    });
  }

  const fleet = await generateFleet(prisma, 100);
  for (const vehicle of fleet) {
    await prisma.fleet.create({
      data: vehicle,
    });
  }

  const leasings = await generateLeasings(prisma);
  for (const leasing of leasings) {
    await prisma.leasing.create({ data: leasing });
  }

  const invoices = await generateInvoices(prisma);
  for (const invoice of invoices) {
    await prisma.invoice.create({ data: invoice });
  }

  const payments = await generatePayments(prisma);
  for (const payment of payments) {
    await prisma.payment.create({ data: payment });
  }

  const maintenanceReports = await generateMaintenanceReports(prisma);
  for (const report of maintenanceReports) {
    await prisma.maintenanceReport.create({ data: report });
  }

  const damageReports = await generateDamageReports(prisma);
  for (const report of damageReports) {
    await prisma.damageReport.create({ data: report });
  }
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
