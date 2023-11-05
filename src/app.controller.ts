import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(AppInterceptor)
  getHello(): string {
    return this.appService.getHello().replace('World !', 'Nest !');
  }
}
