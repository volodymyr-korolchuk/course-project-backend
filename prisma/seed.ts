import { PrismaClient } from '@prisma/client';
import {
  generateCustomers,
  generateDamageReports,
  generateFinanceAnalytics,
  generateFleet,
  generateInvoices,
  generateLeasings,
  generateMaintenanceReports,
  generateParkingLocations,
  generatePayments,
  generateStaff,
  generateUser,
  generateVehicleClasses,
  getRoles,
} from './seedingFunctions';
import { faker } from '@faker-js/faker';
import { DB_ROLES_ID } from '../src/constants/index';

const prisma = new PrismaClient();

async function isDatabaseEmpty() {
  try {
    const modelNames = [
      'Role',
      'User',
      'Customer',
      'Staff',
      'Fleet',
      'VehicleClass',
      'ParkingLocation',
      'Leasing',
      'Invoice',
      'Payment',
      'MaintenanceReport',
      'DamageReport',
      'MonthlyAnalytics',
    ];

    for (const modelName of modelNames) {
      const count = await prisma[modelName].count();
      if (count > 0) {
        console.error(
          '\x1b[31m%s\x1b[0m',
          `\nFailed to seed the database! --> Table ${modelName} is not empty.`,
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking if database is not empty:', error);
    return false;
  }
}

async function main() {
  const isDbEmpty = await isDatabaseEmpty();

  if (!isDbEmpty) {
    return;
  }

  const roles = getRoles();
  for (const role of roles) {
    await prisma.role.create({ data: { title: role } });
  }

  const staff = await generateStaff(10);
  for (const employee of staff) {
    const roleId = faker.number.int({ min: 3, max: 4 });
    await prisma.user.create({
      data: await generateUser(roleId),
    });
    await prisma.staff.create({ data: employee });
  }

  const customers = await generateCustomers(prisma, 100);
  for (const customer of customers) {
    await prisma.user.create({
      data: await generateUser(DB_ROLES_ID.Customer),
    });
    await prisma.customer.create({ data: customer });
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

  const leasings = await generateLeasings(prisma, 2000);
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

  const monthlyAnalytics = await generateFinanceAnalytics(prisma);
  for (const report of monthlyAnalytics) {
    await prisma.monthlyAnalytics.create({ data: report });
  }
}

main()
  .catch((err) => {
    console.log(err);
    console.log(err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
