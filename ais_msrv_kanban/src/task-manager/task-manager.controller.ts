import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedUser, AuthGuard } from 'nest-keycloak-connect';
import { CreateSectionDto } from 'src/DTO/create-section-dto';
import { CreateTaskDto } from 'src/DTO/create-task-dto';
import { TaskManagerService } from './task-manager.service';
import { TaskSchema } from 'src/schemas/task.schema';
import { TaskSectionSchema } from 'src/schemas/taskSection.schema';
import { CreateReportDto } from 'src/DTO/create-report-dto';
import { Report } from 'src/schemas/report.schema';
import { AuthDecorator } from 'src/decorators/auth.decorator';
import { TokenInterceptor } from 'src/interceptors/token.interceptor';
import { RESOURCES } from 'src/resources';
import { CreateUserColumnDto } from 'src/DTO/create-user-column.dto';
import { AssignTaskToUser } from 'src/DTO/assign-task-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/task-manager')
export class TaskManagerController {
  constructor(private taskManagerService: TaskManagerService) {}

  @Get()
  syncResource() {
    return RESOURCES
  }

  @Get("/all-tasks")
  get_taskSchema_allTasks(@AuthenticatedUser() user: any) {
    return this.taskManagerService.getAllTasks(user.sub)
  }

  @Get("/assigned-tasks")
  get_taskSchema_assignedTasks(@AuthenticatedUser() user: any) {
    return this.taskManagerService.getAssignedTasks(user.sub)
  }

  // @Get('/user-sections')
  // @UseInterceptors(TokenInterceptor)
  // @AuthDecorator()
  // get_taskSectionSchema_UserSections(@AuthenticatedUser() user: any) {
  //   console.log(user);
  //   return this.taskManagerService.getUserSections(user.sub);
  // }

  @Get('/sub-tasks/:id')
  get_taskSchema_TaskTree(@AuthenticatedUser() user: any, @Param('id') id: number) {
    console.log(id);
    return this.taskManagerService.getSubTasks(id);
  }

  @Post('/set-do-after')
  post_taskSchema_setDoAfter(@AuthenticatedUser() user: any, @Body() taskIds: {beforeTaskId: number, afterTaskId: number}) {
    return this.taskManagerService.setDoAfterTask(taskIds.beforeTaskId, taskIds.afterTaskId)
  }

  @Post('/add-file-to-task/:id')
  @UseInterceptors(FileInterceptor('file'))
  post_taskSchema_addFileToTask(@AuthenticatedUser() user: any, @UploadedFile() file: Express.Multer.File, @Param("id") id: number) {
    return this.taskManagerService.addFileToTask(file, id)
  }

  @Delete("/remove-file-from-task/:id/:fileName")  
  delete_taskSchema_removeFile(@AuthenticatedUser() user: any, @Param("id") id: number, @Param("fileName") fileName: string) {
    return this.taskManagerService.removeFile(fileName, id)
  }

  @Post('/create-task')
  post_taskSchema_task(@AuthenticatedUser() user: any, @Body() dto: CreateTaskDto) {
    return this.taskManagerService.createTask(dto, user.sub);
  }

  @Get('/get-tasks-tree')
  get_taskSchema_TasksTree(@AuthenticatedUser() user: any) {
    return this.taskManagerService.getTasksTree(user.sub);
  }

  @Get('/get-assigned-columns')
  get_UserColumn_AssignedColumns(@AuthenticatedUser() user: any) {
    return this.taskManagerService.getAssignedUserColumns(user)
  }

  @Patch('/add-sub-task/:id')
  update_taskSchema_addSubTask(
    @AuthenticatedUser() user: any,
    @Param('id') id: number,
    @Body() task: TaskSchema,
  ) {
    return this.taskManagerService.addSubTask(id, task, user);
  }

  @Patch(':id')
  update_taskSchema_Task(@AuthenticatedUser() user: any, @Param('id') id: number, @Body() task: TaskSchema) {
    return this.taskManagerService.updateTask(id, task);
  }

  @Patch('task-section/:id')
  update_taskSectionSchema_TaskSection(
    @AuthenticatedUser() user: any,
    @Param('id') id: number,
    @Body() taskSection: TaskSectionSchema,
  ) {
    return this.taskManagerService.updateTaskSection(id, taskSection);
  }

  @Post('/update-task-sections')
  async update_taskSectionSchema_TaskSections(@AuthenticatedUser() user: any, @Body() sections) {
    await this.taskManagerService.updateTaskSections(sections);
  }

  @Post('/create-user-column')
  post_UserColumn_UserColumn(@AuthenticatedUser() user: any, @Body() dto: CreateUserColumnDto) {
    return this.taskManagerService.createUserColumn(user, dto)
  }

  @Delete('/delete-user-column/:id')
  delete_UserColumn_UserColumn(@AuthenticatedUser() user: any, @Param('id') columnId: number) {
    return this.taskManagerService.deleteUserColumn(columnId)
  }

  @Post('/assign-task')
  post_UserColumn_assignToUser(@AuthenticatedUser() user: any, @Body() dto: AssignTaskToUser) {
    return this.taskManagerService.assignTaskToUser(user, dto.performerId, dto.taskId)
  }

  @Delete('/delete-task/:id')
  delete_taskSchema_Task(@AuthenticatedUser() user: any, @Param('id') taskId: number) {
    console.log(taskId);
    return this.taskManagerService.deleteTask(taskId);
  }

  @Delete('/delete-section/:id')
  delete_taskSectionSchema_Section(@AuthenticatedUser() user: any, @Param('id') sectionId: number) {
    return this.taskManagerService.deleteSection(sectionId);
  }
}
