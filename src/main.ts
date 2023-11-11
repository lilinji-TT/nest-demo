import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public', {
    prefix: '/static',
  });
  // session
  app.use(
    session({
      secret: 'li',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
