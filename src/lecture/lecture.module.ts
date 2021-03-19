import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from 'middleware/jwt.middleware';
import { AuditorModule } from 'auditor/auditor.module';
import { LectureRepository } from './lecture.repository';
import { TokenModule } from 'token/token.module';
import { UserModule } from 'user/user.module';
import { AuditorRepository } from 'auditor/auditor.repository';
import { UserRepository } from 'user/user.repository';
import { LectureGateway } from 'lecture/lecture.gateway';
import { RedisClientModule } from 'redis-client/redis-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LectureRepository,
      AuditorRepository,
      UserRepository
    ]),
    TokenModule,
    RedisClientModule,
  ],
  providers: [LectureService, LectureGateway],
  controllers: [LectureController],
})
export class LectureModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        {
          path: '/lecture/join',
          method: RequestMethod.POST
        },
      )
  }
}
