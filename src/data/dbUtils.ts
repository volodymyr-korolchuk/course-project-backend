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

export async function getUserByEmail(client: PrismaClient, email: string) {
  return await client.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getCustomerByUserId(client: PrismaClient, id: number) {
  return await client.customer.findUnique({
    where: {
      userId: id,
    },
  });
}

export async function getEmployeeByUserId(client: PrismaClient, id: number) {
  return await client.staff.findUnique({
    where: {
      userId: id,
    },
  });
}

export async function getRoleTitleById(client: PrismaClient, id: number) {
  const role = await client.role.findUnique({
    where: { id },
    select: {
      title: true,
    },
  });
  return role.title;
}
