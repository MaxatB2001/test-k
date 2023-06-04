import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [MinioClientService],
  exports: [MinioClientService],
  imports: [
    ConfigModule.forRoot(),
  ]
})
export class MinioClientModule {}
