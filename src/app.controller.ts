import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  Query,
  Res,
  Session,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';

interface QrCodeInfo {
  status:
    | 'noscan'
    | 'scan-wait-confirm'
    | 'scan-confirm'
    | 'scan-cancel'
    | 'expired';
  userInfo?: {
    userId: number;
  };
}
const map = new Map<string, QrCodeInfo>();
@Controller()
export class AppController {
  private users = [
    { id: 1, username: 'li', password: '111' },
    { id: 2, username: 'lilinji', password: '111' },
  ];
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

  @Get('qrcode/check')
  async check(@Query('id') id: string) {
    return map.get(`qrcode_${id}`);
  }

  @Get('qrcode/scan')
  async scan(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);

    if (!info) {
      throw new BadRequestException('二维码已过期');
    }

    info.status = 'scan-wait-confirm';

    return 'success';
  }

  @Get('qrcode/confirm')
  async confirm(
    @Query('id') id: string,
    @Headers('Authorization') auth: string,
  ) {
    let user;
    try {
      const [, token] = auth.split(' ');
      const info = await this.jwtService.verify(token);

      user = this.users.find((item) => item.id == info.userId);
    } catch (e) {
      throw new UnauthorizedException('token 过期，请重新登录');
    }
    const info = map.get(`qrcode_${id}`);

    if (!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 'scan-confirm';
    info.userInfo = user;
    return 'success';
  }

  @Get('qrcode/cancel')
  async cancel(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);
    if (!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 'scan-cancel';
    return 'success';
  }

  @Get('qrcode/generate')
  async getQrcodeGenerate() {
    const uuid = randomUUID();
    const dataUrl = await qrcode.toDataURL(
      `http://192.168.10.101:3000/pages/confirm.html?id=${uuid}`,
    );
    map.set(`qrcode_${uuid}`, {
      status: 'noscan',
    });
    return {
      qrcode_id: uuid,
      img: dataUrl,
    };
  }

  @Get('login')
  async login(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    const user = this.users.find((item) => item.username === username);

    if (!user) {
      throw new UnauthorizedException(username + '不存在');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }
    console.log(user.username);
    return {
      token: this.jwtService.sign({
        userId: user.id,
      }),
    };
  }

  @Get('userInfo')
  async userInfo(@Headers('Authorization') auth: string) {
    try {
      const [, token] = auth.split(' ');
      const info = await this.jwtService.verify(token);

      const user = this.users.find((item) => item.id == info.userId);
      return user;
    } catch (e) {
      throw new UnauthorizedException('token 过期，请重新登录');
    }
  }
}
