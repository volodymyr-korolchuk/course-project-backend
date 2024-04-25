import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { DB_ROLES } from '../src/constants/index';

const VEHICLE_CLASSES = [
  {
    title: 'SUV',
    pricePerHour: 160,
  },
  {
    title: 'Sedan',
    pricePerHour: 150,
  },
  {
    title: 'Van',
    pricePerHour: 190,
  },
  {
    title: 'Hatchback',
    pricePerHour: 100,
  },
  {
    title: 'Minivan',
    pricePerHour: 170,
  },
];

export const INVOICE_STATUSES = ['closed', 'pending'];

export function getRoles() {
  return Object.values(DB_ROLES);
}

export function getVehicleClasses() {
  const vehicleClasses = [];
  for (let vehicleClass of VEHICLE_CLASSES) {
    vehicleClasses.push({
      ...vehicleClass,
      description: faker.lorem.sentences(5),
    });
  }

  return vehicleClasses;
}

async function generateUsers(prisma: PrismaClient, amount: number) {
  const users = [];
  const roles = await prisma.role.findMany();

  for (let i = 0; i < amount; i++) {
    const user = {
      email: faker.internet.email(),
      hashedPassword: faker.internet.password(),
      roleId: faker.number.int({ min: 1, max: roles.length }),
    };

    users.push(user);
  }

  return users;
}

export async function generateUser(roleId: number) {
  return {
    email: faker.internet.email(),
    hashedPassword: faker.internet.password(),
    roleId,
  };
}

export async function generateCustomers(prisma: PrismaClient, amount: number) {
  const customers = [];
  const employees = await prisma.staff.findMany();

  for (let i = employees.length; i < amount; i++) {
    const customer = {
      userId: i + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number().slice(0, 15),
    };

    customers.push(customer);
  }

  return customers;
}

export async function generateStaff(amount: number) {
  const staff = [];

  for (let i = 0; i < amount; i++) {
    const employee = {
      userId: i + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      patronymic: faker.person.middleName(),
    };

    staff.push(employee);
  }

  return staff;
}

export async function generateSalaryPayments(prisma: PrismaClient) {
  const salaryPayments = [];
  const employees = await prisma.staff.findMany();

  for (let i = 0; i < employees.length; i++) {
    const payment = {
      employeeId: i + 1,
      totalAmount: faker.number.int({ min: 1000, max: 10000 }),
    };

    salaryPayments.push(payment);
  }

  return salaryPayments;
}

export async function generateParkingLocations(amount: number) {
  const locations = [];

  for (let i = 0; i < amount; i++) {
    const location = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    locations.push(location);
  }

  return locations;
}

export function generateVehicleClasses() {
  const vehicleClasses = [];
  for (let vehicleClass of VEHICLE_CLASSES) {
    vehicleClasses.push({
      ...vehicleClass,
      description: faker.lorem.sentences(5),
    });
  }

  return vehicleClasses;
}

export async function generateFleet(prisma: PrismaClient, amount: number) {
  const fleet = [];

  const parkingLocations = await prisma.parkingLocation.findMany();
  const vehicleClasses = await prisma.vehicleClass.findMany();

  for (let i = 0; i < amount; i++) {
    const vehicle = {
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      productionYear: faker.number.int({ min: 1995, max: 2023 }),
      classId: faker.number.int({ min: 1, max: vehicleClasses.length }),
      mileage: faker.number.int({ min: 400, max: 200000 }),
      color: faker.color.human(),
      vrm: faker.vehicle.vrm(),
      parkingLocationId: faker.number.int({
        min: 1,
        max: parkingLocations.length,
      }),
    };

    fleet.push(vehicle);
  }

  return fleet;
}

export async function generateLeasings(prisma: PrismaClient) {
  const leasings = [];
  const cutsomers = await prisma.customer.findMany();
  const fleet = await prisma.fleet.findMany();
  const staff = await prisma.staff.findMany();

  for (let i = 0; i < cutsomers.length; i++) {
    if (i + 1 > fleet.length) {
      break;
    }

    const leasing = {
      vehicleId: i + 1,
      createdByEmployeeId: faker.number.int({ min: 1, max: staff.length }),
      customerId: i + 1,
      pickupDate: faker.date.between({
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-02-28T00:00:00.000Z',
      }),
      returnDate: faker.date.between({
        from: '2024-01-10T00:00:00.000Z',
        to: '2024-03-10T00:00:00.000Z',
      }),
      allowedMileage: faker.number.int({ min: 100, max: 5000 }),
    };

    leasings.push(leasing);
  }

  return leasings;
}

export async function getPricePerHourAndDurationForLeasing(
  prisma: PrismaClient,
  leasingId,
) {
  try {
    const leasing = await prisma.leasing.findUnique({
      where: {
        id: leasingId,
      },
      include: {
        Vehicle: {
          include: {
            VehicleClass: true,
          },
        },
      },
    });

    if (!leasing || !leasing.Vehicle || !leasing.Vehicle.VehicleClass) {
      throw new Error('--> Leasing or associated vehicle not found');
    }

    // Calculate the rental duration in days
    const pickupDate = new Date(leasing.pickupDate);
    const returnDate = new Date(leasing.returnDate);
    const durationInMilliseconds = returnDate.getTime() - pickupDate.getTime();
    const durationInDays = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60 * 24),
    );

    return {
      pricePerHour: leasing.Vehicle.VehicleClass.pricePerHour,
      durationInDays: durationInDays,
    };
  } catch (error) {
    console.error('--> Error retrieving price per hour and duration:', error);
    throw error;
  }
}

// depends on leasings
export async function generateInvoices(prisma: PrismaClient) {
  const invoices = [];
  const leasings = await prisma.leasing.findMany();

  for (let i = 0; i < leasings.length; i++) {
    const { pricePerHour, durationInDays } =
      await getPricePerHourAndDurationForLeasing(prisma, leasings[i].id);
    const invoice = {
      leasingId: i + 1,
      amountDue: Number(pricePerHour) * durationInDays,
      insuranceAmount: faker.number.int({ min: 0, max: 2000 }),
      status:
        INVOICE_STATUSES[
          faker.number.int({ min: 0, max: INVOICE_STATUSES.length - 1 })
        ],
    };

    invoices.push(invoice);
  }

  return invoices;
}

export async function generatePayments(prisma: PrismaClient) {
  const payments = [];
  const leasings = await prisma.leasing.findMany();
  const invoices = await prisma.invoice.findMany();

  for (let i = 0; i < invoices.length; i++) {
    const payment = {
      invoiceId: i + 1,
      createdOn: leasings[i].pickupDate,
      totalAmount:
        Number(invoices[i].amountDue) + Number(invoices[i].insuranceAmount),
    };

    payments.push(payment);
  }

  return payments;
}

export async function generateMaintenanceReports(prisma: PrismaClient) {
  const reports = [];
  const fleet = await prisma.fleet.findMany();

  const numberOfReports = Math.round(fleet.length / 3);

  for (let i = 0; i < numberOfReports; i++) {
    const report = {
      vehicleId: faker.number.int({ min: 1, max: fleet.length }),
      startDate: faker.date.between({
        from: '2023-05-01T00:00:00.000Z',
        to: '2023-09-28T00:00:00.000Z',
      }),
      endDate: faker.date.between({
        from: '2023-06-01T00:00:00.000Z',
        to: '2023-10-30T00:00:00.000Z',
      }),
      description: faker.lorem.sentences(15),
      totalCost: faker.number.int({ min: 200, max: 5000 }),
    };

    reports.push(report);
  }

  return reports;
}

export async function generateDamageReports(prisma: PrismaClient) {
  const reports = [];

  const fleet = await prisma.fleet.findMany();

  const numberOfReports = Math.round(fleet.length / 4);

  for (let i = 0; i < numberOfReports; i++) {
    const report = {
      vehicleId: faker.number.int({ min: 1, max: fleet.length }),
      description: faker.lorem.sentences(15),
    };

    reports.push(report);
  }

  return reports;
}

export async function generateFinanceAnalytics(prisma: PrismaClient) {
  const monthlyAnalytics = [];
  const startMonth = await prisma.leasing.findFirst({
    orderBy: { pickupDate: 'asc' },
    select: {
      pickupDate: true,
    },
  });

  const endMonth = await prisma.leasing.findFirst({
    orderBy: { returnDate: 'desc' },
    select: {
      returnDate: true,
    },
  });

  const startDate = new Date(startMonth.pickupDate);
  const endDate = new Date(endMonth.returnDate);

  const diffInMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  for (let i = 0; i < diffInMonths; i++) {
    const analytics = {
      leasingsIncome: faker.number.int({ min: 10000, max: 50000 }),
      salariesPaid: faker.number.int({ min: 8000, max: 15000 }),
      taxesPaid: faker.number.int({ min: 1000, max: 7000 }),
      maintenanceExpenses: faker.number.int({ min: 200, max: 5000 }),
      fuelExpenses: faker.number.int({ min: 800, max: 2000 }),
      createdOn: new Date(`2024-${i < 10 ? `0${i + 1}` : `${i + 1}`}-28`),
    };

    monthlyAnalytics.push(analytics);
  }

  return monthlyAnalytics;
}
