import { PrismaClient } from '@prisma/client';
import {
  generateFleet,
  generateParkingLocations,
  getRoles,
  getVehicleClasses,
} from './seedData';

const prisma = new PrismaClient();

async function main() {
  const roles = getRoles();
  const parkingLocations = generateParkingLocations(200);
  const vehicleClasses = getVehicleClasses();
  const fleet = generateFleet(1000, 200);

  for (let role of roles) {
    await prisma.role.create({ data: { title: role } });
  }

  for (let location of parkingLocations) {
    await prisma.parkingLocation.create({
      data: {
        address: location,
      },
    });
  }

  for (let vehicleClass of vehicleClasses) {
    await prisma.vehicleClass.create({
      data: {
        ...vehicleClass,
      },
    });
  }

  for (let vehicle of fleet) {
    await prisma.fleet.create({
      data: {
        ...vehicle,
      },
    });
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
