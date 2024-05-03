import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AggregateByTenantContextIdStrategy } from './tenants/tenant.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
  await app.listen(5000);
}
bootstrap();
