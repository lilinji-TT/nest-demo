import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppMidwareMiddleware } from './app-midware.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';

@Module({
  imports: [PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMidwareMiddleware).forRoutes('*');
  }
}
