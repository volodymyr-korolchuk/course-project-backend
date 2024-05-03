import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLeasingDto } from './dto/create-leasing.dto';
import { UpdateLeasingDto } from './dto/update-leasing.dto';
import { PrismaClientManager } from 'src/manager/manager.service';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import {
  checkCustomerIdExists,
  checkEmployeeIdExists,
  checkLeasingIdExists,
  checkVehicleIdExists,
  getTodaysPickupsQuery,
  getTodaysReturnsQuery,
  getTomorrowsPickupsQuery,
  getTomorrowsReturnsQuery,
} from 'src/data/dbUtils';

@Injectable()
export class LeasingsService {
  constructor(private readonly manager: PrismaClientManager) {}

  async create(tenantId: string, createLeasingDto: CreateLeasingDto) {
    try {
      const client = await this.manager.getClient(tenantId);

      const vehicleExists = await checkVehicleIdExists(
        client,
        createLeasingDto.vehicleId,
      );

      if (!vehicleExists) {
        throw new BadRequestException('Vehicle does not exist.');
      }

      const employeeExists = await checkEmployeeIdExists(
        client,
        createLeasingDto.createdByEmployeeId,
      );

      if (!employeeExists) {
        throw new BadRequestException('Employee does not exist.');
      }

      const customerExists = await checkCustomerIdExists(
        client,
        createLeasingDto.customerId,
      );

      if (!customerExists) {
        throw new BadRequestException('Customer does not exist.');
      }

      // forbid to put invalid dates on frontend. anyway, compare dates here.

      const result = await client.leasing.create({
        data: createLeasingDto,
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      // Modify the query to include all necessary fields
      const result = await client.leasing.findMany({
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });

      const leasings = result.map((leasing) => ({
        id: leasing.id,
        email: leasing.Customer.User.email,
        pickupDate: leasing.pickupDate.toLocaleString(),
        returnDate: leasing.returnDate.toLocaleString(),
        pickupLocation: leasing.Vehicle.ParkingLocation.address,
        vehicleClass: leasing.Vehicle.VehicleClass.title,
        vehicle: `${leasing.Vehicle.make} ${leasing.Vehicle.model}`,
        amountDue: leasing.Invoice.amountDue,
      }));

      return leasings;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch leasings');
    }
  }

  async findOne(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      return await client.leasing.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findTodaysPickups(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      const today = new Date();
      const todayDateString = today.toISOString().slice(0, 10);

      // Retrieve leasings with pickupDate set to today's date
      const pickups = await client.leasing.findMany({
        where: {
          pickupDate: {
            gte: new Date(todayDateString),
            lt: new Date(todayDateString + 'T23:59:59.999Z'),
          },
        },
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });

      return pickups.map((item) => {
        return {
          id: item.id,
          email: item.Customer.User.email,
          pickupDate: item.pickupDate.toLocaleString(),
          returnDate: item.returnDate.toLocaleString(),
          pickupLocation: item.Vehicle.ParkingLocation.address,
          vehicleClass: item.Vehicle.VehicleClass.title,
          vehicle: `${item.Vehicle.make} ${item.Vehicle.model}`,
          amountDue: item.Invoice.amountDue,
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findTodaysReturns(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      const today = new Date();
      const todayDateString = today.toISOString().slice(0, 10);

      const returns = await client.leasing.findMany({
        where: {
          returnDate: {
            gte: new Date(todayDateString),
            lt: new Date(todayDateString + 'T23:59:59.999Z'), // Ensure it's within the entire day
          },
        },
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });

      return returns.map((item) => {
        return {
          id: item.id,
          email: item.Customer.User.email,
          pickupDate: item.pickupDate.toLocaleString(),
          returnDate: item.returnDate.toLocaleString(),
          pickupLocation: item.Vehicle.ParkingLocation.address,
          vehicleClass: item.Vehicle.VehicleClass.title,
          vehicle: `${item.Vehicle.make} ${item.Vehicle.model}`,
          amountDue: item.Invoice.amountDue,
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findTomorrowsPickups(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = tomorrow.toISOString().slice(0, 10);

      const rentals = await client.leasing.findMany({
        where: {
          pickupDate: {
            gte: new Date(tomorrowDateString),
            lt: new Date(tomorrowDateString + 'T23:59:59.999Z'), // Ensure it's within the entire day
          },
        },
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });

      return rentals.map((item) => {
        return {
          id: item.id,
          email: item.Customer.User.email,
          pickupDate: item.pickupDate.toLocaleString(),
          returnDate: item.returnDate.toLocaleString(),
          pickupLocation: item.Vehicle.ParkingLocation.address,
          vehicleClass: item.Vehicle.VehicleClass.title,
          vehicle: `${item.Vehicle.make} ${item.Vehicle.model}`,
          amountDue: item.Invoice.amountDue,
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findTomorrowsReturns(tenantId: string) {
    try {
      const client = await this.manager.getClient(tenantId);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = tomorrow.toISOString().slice(0, 10);

      const returns = await client.leasing.findMany({
        where: {
          returnDate: {
            gte: new Date(tomorrowDateString),
            lt: new Date(tomorrowDateString + 'T23:59:59.999Z'), // Ensure it's within the entire day
          },
        },
        select: {
          id: true,
          pickupDate: true,
          returnDate: true,
          Customer: {
            select: {
              User: {
                select: {
                  email: true,
                },
              },
            },
          },
          Vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              VehicleClass: {
                select: {
                  title: true,
                },
              },
              ParkingLocation: {
                select: {
                  address: true,
                },
              },
            },
          },

          Invoice: {
            select: {
              amountDue: true,
            },
          },
        },
      });

      return returns.map((item) => {
        return {
          id: item.id,
          email: item.Customer.User.email,
          pickupDate: item.pickupDate.toLocaleString(),
          returnDate: item.returnDate.toLocaleString(),
          pickupLocation: item.Vehicle.ParkingLocation.address,
          vehicleClass: item.Vehicle.VehicleClass.title,
          vehicle: `${item.Vehicle.make} ${item.Vehicle.model}`,
          amountDue: item.Invoice.amountDue,
        };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    tenantId: string,
    id: number,
    updateLeasingDto: UpdateLeasingDto,
  ) {
    try {
      const client = await this.manager.getClient(tenantId);

      if (updateLeasingDto?.vehicleId) {
        const vehicleExists = await checkVehicleIdExists(
          client,
          updateLeasingDto.vehicleId,
        );

        if (!vehicleExists) {
          throw new BadRequestException('Vehicle does not exist.');
        }
      }

      if (updateLeasingDto?.createdByEmployeeId) {
        const employeeExists = await checkEmployeeIdExists(
          client,
          updateLeasingDto.createdByEmployeeId,
        );

        if (!employeeExists) {
          throw new BadRequestException('Employee does not exist.');
        }
      }

      if (updateLeasingDto?.customerId) {
        const customerExists = await checkCustomerIdExists(
          client,
          updateLeasingDto.customerId,
        );

        if (!customerExists) {
          throw new BadRequestException('Customer does not exist.');
        }
      }

      // also check dates here

      const result = await client.leasing.update({
        where: {
          id,
        },
        data: updateLeasingDto,
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(tenantId: string, id: number) {
    try {
      const client = await this.manager.getClient(tenantId);

      const leasingExists = await checkLeasingIdExists(client, id);
      if (!leasingExists) {
        throw new BadRequestException('Leasing does not exist.');
      }

      const result = await client.leasing.delete({ where: { id } });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof PrismaClientUnknownRequestError) {
      throw new ForbiddenException(
        'You don`t have permissions to perform such action.',
      );
    }
    throw new InternalServerErrorException(error.message);
  }
}
