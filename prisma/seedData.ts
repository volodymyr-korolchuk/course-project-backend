import { faker } from '@faker-js/faker';

const ROLES = ['GUEST', 'CONSULTANT', 'ADMIN'];
const VEHICLE_CLASSES = [
  {
    title: 'SUV',
    pricePerHour: 160,
    description: 'Lorem ipsum dolor sit amet',
  },
  {
    title: 'Sedan',
    pricePerHour: 150,
    description: 'Lorem ipsum dolor sit amet',
  },
  {
    title: 'Van',
    pricePerHour: 190,
    description: 'Lorem ipsum dolor sit amet',
  },
  {
    title: 'Hatchback',
    pricePerHour: 100,
    description: 'Lorem ipsum dolor sit amet',
  },
  {
    title: 'Minivan',
    pricePerHour: 170,
    description: 'Lorem ipsum dolor sit amet',
  },
];

export const getRoles = () => ROLES;
export const getVehicleClasses = () => VEHICLE_CLASSES;

export const generateParkingLocations = (amount: number) => {
  const locations = [];
  for (let i = 0; i < amount; i++) {
    const location = `${faker.location.city()}, ${faker.location.streetAddress()}`;
    locations.push(location);
  }

  return locations;
};

export const generateFleet = (
  vehiclesAmount: number,
  parkingLocationsAmount: number,
) => {
  const fleet = [];

  for (let i = 0; i < vehiclesAmount; i++) {
    const vehicle = {
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      productionYear: faker.number.int({ min: 1995, max: 2023 }),
      classId: faker.number.int({ min: 1, max: VEHICLE_CLASSES.length }),
      mileage: faker.number.int({ min: 400, max: 200000 }),
      vin: faker.vehicle.vin(),
      parkingLocationId: faker.number.int({
        min: 1,
        max: parkingLocationsAmount,
      }),
    };

    fleet.push(vehicle);
  }

  return fleet;
};
