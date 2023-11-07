import {
  Controller,
  Get,
  Headers,
  Inject,
  Res,
  Session,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';
@Controller()
export class AppController {
  @Inject(JwtService)
  private jwtService: JwtService;
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(AppInterceptor)
  getHello(): string {
    return this.appService.getHello().replace('World !', 'Nest !');
  }

  @Get('sss')
  sss(@Session() session) {
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get('ttt')
  ttt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);
        console.log(data);
        const newToken = this.jwtService.sign({
          count: data.count + 1,
        });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (e) {
        console.log(e);
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1,
      });

      response.setHeader('token', newToken);
      return 1;
    }
  }
}
