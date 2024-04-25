import {
  FactoryProvider,
  Injectable,
  OnModuleDestroy,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { DB_BASE_URL } from 'src/constants';

export class ExtendedPrismaClient extends PrismaClient {
  clientName: string;
  connectionString: string;
}

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: ExtendedPrismaClient } = {};

  async getClient(tenantId: string): Promise<ExtendedPrismaClient> {
    let client = this.clients[tenantId];

    if (!client) {
      const dbUrl = DB_BASE_URL.replace(
        'username',
        tenantId.toLowerCase(),
      ).replace('password', tenantId.toLowerCase());

      client = new ExtendedPrismaClient({
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      });

      client.clientName = tenantId;
      client.connectionString = dbUrl;
      await client.$connect();

      this.clients[tenantId] = client;
    }

    return client;
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect()),
    );
  }
}

export interface ContextPayload {
  tenantId: string;
}

export const prismaClientProvider: FactoryProvider<PrismaClient> = {
  provide: PrismaClient,
  scope: Scope.REQUEST,
  durable: true, // Makes this provider durable
  useFactory: (ctxPayload: ContextPayload, manager: PrismaClientManager) => {
    return manager.getClient(ctxPayload.tenantId);
  },
  inject: [REQUEST, PrismaClientManager],
};
