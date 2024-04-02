import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  testGetRoute() {
    return 'app get route is working fine';
  }
}
