import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {}

  onModuleInit() {
    this.test();
  }

  async test() {
    
  }
}
