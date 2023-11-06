import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public', {
    prefix: '/static',
  });
  app.enableCors();
  // 增加 JSON 请求体的大小限制为50mb
  app.use(json({ limit: '50mb' }));

  // 增加 URL-encoded 请求体的大小限制为50mb
  app.use(urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
