import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppMidwareMiddleware } from './app-midware.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
@Module({
  imports: [
    PersonModule,
    JwtModule.register({
      secret: 'li',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMidwareMiddleware).forRoutes('*');
  }
}
