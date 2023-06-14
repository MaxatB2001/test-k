import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSchema } from 'src/schemas/task.schema';
import { TaskSectionSchema } from 'src/schemas/taskSection.schema';
import { TaskManagerController } from './task-manager.controller';
import { TaskManagerService } from './task-manager.service';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { Report } from 'src/schemas/report.schema';
import { UserColumnShema } from 'src/schemas/UserColumn.schema';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskSectionSchema,
      TaskSchema,
      Report,
      UserColumnShema,
    ]),
    KeycloakModule,
    MinioClientModule,
  ],
  controllers: [TaskManagerController],
  providers: [TaskManagerService],
})
export class TaskManagerModule {}
