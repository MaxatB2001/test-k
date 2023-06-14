import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZeebeModule, ZeebeServer } from 'nestjs-zeebe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakModule } from './keycloak/keycloak.module';
import { TaskSchema } from './schemas/task.schema';
import { TaskSectionSchema } from './schemas/taskSection.schema';
import { TaskManagerModule } from './task-manager/task-manager.module';
import { Report } from './schemas/report.schema';
import { UserColumnShema } from './schemas/UserColumn.schema';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST,
      port: parseInt(process.env.POSTGRESQL_USER),
      username: process.env.POSTGRESQL_USER,
      password: process.env.POSTGRESQL_PASS,
      database: process.env.POSTGRESQL_DB,
      entities: [TaskSchema, TaskSectionSchema, Report, UserColumnShema],
      synchronize: true,
      autoLoadEntities: true
    }
    ),

    ZeebeModule.forRoot({ gatewayAddress: process.env.ZEEBE_ADDRESS }),
    KeycloakModule,
    TaskManagerModule,
    MinioClientModule,
    ],
  providers: [
    ZeebeServer,
    AppService
  ],
  controllers: [AppController],
})
export class AppModule {}
