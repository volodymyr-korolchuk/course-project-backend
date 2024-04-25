import { PrismaClient } from '@prisma/client';

export async function checkVehicleClassIdExists(
  client: PrismaClient,
  id: number,
) {
  return !!(await client.vehicleClass.findUnique({
    where: {
      id,
    },
  }));
}

export async function checkParkingLocationIdExists(
  client: PrismaClient,
  id: number,
) {
  return !!(await client.parkingLocation.findUnique({
    where: {
      id,
    },
  }));
}

export async function checkVehicleVrmExists(client: PrismaClient, vrm: string) {
  return !!(await client.fleet.findFirst({
    where: {
      vrm,
    },
  }));
}

export async function checkVehicleIdExists(client: PrismaClient, id: number) {
  return !!(await client.fleet.findUnique({
    where: {
      id,
    },
  }));
}

export async function checkCustomerIdExists(client: PrismaClient, id: number) {
  return !!(await client.customer.findUnique({
    where: {
      id,
    },
  }));
}

export async function checkLeasingIdExists(client: PrismaClient, id: number) {
  return !!(await client.leasing.findUnique({
    where: {
      id,
    },
  }));
}

export async function checkEmployeeIdExists(client: PrismaClient, id: number) {
  return !!(await client.staff.findUnique({
    where: {
      id,
    },
  }));
}
