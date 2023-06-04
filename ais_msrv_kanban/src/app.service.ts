import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './DTO/create-section-dto';
import { TaskSectionSchema } from './schemas/taskSection.schema';

@Injectable()
export class AppService {
  constructor() {}
}
