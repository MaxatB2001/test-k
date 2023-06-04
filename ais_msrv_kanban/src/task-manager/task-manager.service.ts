import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { CreateSectionDto } from 'src/DTO/create-section-dto';
import { CreateTaskDto } from 'src/DTO/create-task-dto';
import { CreateUserColumnDto } from 'src/DTO/create-user-column.dto';
import {
  importanceCoefficients,
  taskComplexityCoefficients,
  urgencyCoefficients,
} from 'src/data/coefficients';
import { Importance } from 'src/enums/importance.enum';
import { TaskComplexity } from 'src/enums/task-complexity.enum';
import { TaskStatus } from 'src/enums/task-status.enum';
import { Urgency } from 'src/enums/urgency.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { UserColumnShema } from 'src/schemas/UserColumn.schema';
import { TaskSchema } from 'src/schemas/task.schema';
import { TaskSectionSchema } from 'src/schemas/taskSection.schema';
import { getDifferenceInDays } from 'src/utils/date';
import { sortByPosition } from 'src/utils/tasks';
import { DeleteResult, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class TaskManagerService {
  constructor(
    @InjectRepository(TaskSectionSchema)
    private taskSectionRepo: Repository<TaskSectionSchema>,
    @InjectRepository(TaskSchema)
    private taskRepo: Repository<TaskSchema>,
    @InjectRepository(UserColumnShema)
    private userColumnRepo: Repository<UserColumnShema>,
    private minioService: MinioClientService
  ) {}

  // async createTaskSection(
  //   dto: CreateSectionDto,
  //   creatorId: string,
  // ): Promise<TaskSectionSchema> {
  //   const section = await this.taskSectionRepo.save({ ...dto, creatorId });
  //   return { ...section, tasks: [] };
  // }

  async getAllTasks(creatorId: string) {
    const createdTasks = await this.taskRepo.find({where: {creatorId, performer: IsNull(),parentTaskId: IsNull()}, relations: {performer: true, do_after: true, do_before: true, subTask: true}})
    const assignedSubTasks = await this.taskRepo.find({where: {parentTaskId: Not(IsNull()), status: Not(TaskStatus.NEW), creatorId}})
    const assigned = await this.taskRepo.find({where: {performer: {performerId: creatorId}}, relations: {performer: true, do_after: true, do_before: true, subTask: true}})
    createdTasks.forEach(a => console.log(a))
    const newTasks = [...assigned,...assignedSubTasks, ...createdTasks].filter(task => task.status == TaskStatus.NEW || task.status == TaskStatus.ASSIGNED)
    const processTasks = [...assigned,...assignedSubTasks, ...createdTasks].filter(task => task.status == TaskStatus.PROCESS)
    const doneTasks = [...assigned,...assignedSubTasks, ...createdTasks].filter(task => task.status == TaskStatus.DONE)
    return {
      newTasks,
      processTasks,
      doneTasks
    }
  }
  

  async getAssignedTasks(performerId: string) {
    const assignedTasks = await this.taskRepo.find({where: {performer: {performerId}}, relations: {do_after: true, do_before: true, subTask: true}})
    const newTasks = assignedTasks.filter(task => task.status == TaskStatus.ASSIGNED)
    const processTasks = assignedTasks.filter(task => task.status == TaskStatus.PROCESS)
    const doneTasks = assignedTasks.filter(task => task.status == TaskStatus.DONE)
    return {
      newTasks,
      processTasks,
      doneTasks
    }
  }

  // async assigner

  async createTask(dto: CreateTaskDto, creatorId: string) {
    const tasks = await this.taskRepo.find({where: {creatorId, status: TaskStatus.NEW}})
    let position = tasks ? tasks.length : 0;
    const task = this.taskRepo.create({
      title: dto.title,
      creatorId,
      position,
    });
    return await this.taskRepo.save(task);
  }

  async createUserColumn(assignKeycloackUser: any, dto: CreateUserColumnDto,) {
    const isExist = await this.userColumnRepo.findOne({where: {performerId: dto.performerKeycloackUser.id, assignId: assignKeycloackUser.sub}})
    if (isExist) {
      return {exist: true}
    }
    return await this.userColumnRepo.save({...dto, performerId: dto.performerKeycloackUser.id, assignKeycloackUser, assignId: assignKeycloackUser.sub})
  }

  async deleteUserColumn(id: number) {
    return await this.userColumnRepo.delete({id})
  }

  async assignTaskToUser(assignKeycloackUser: any, performerId: string, taskId: number) {
    const userColumn = await this.userColumnRepo.findOne({where: {performerId, assignId: assignKeycloackUser.sub}, relations: {tasks: true}})
    const task = await this.taskRepo.findOne({where: {id: taskId}})
    const upd = await this.taskRepo.update(task.id, {performer: userColumn, status: TaskStatus.ASSIGNED})
    return upd
  }

  async setDoAfterTask(beforeTaskId: number, afterTaskId: number) {
    const task = await this.taskRepo.findOne({where: {id: beforeTaskId}})
    const upd = await this.taskRepo.update(afterTaskId, {do_after: task})
    return upd;
  }

  // async unAssignFromUser(assignKeycloackUser: any, performerId: string, taskId: number) {
  //   const userColumn = await this.userColumnRepo.findOne({where: {performerId, assignId: assignKeycloackUser.sub}, relations: {tasks: true}})
  //   const task = await this.taskRepo.findOne({where: {id: taskId}})
  //   const upd = await this.taskRepo.update(task.id, {performer: null, status: TaskStatus.NEW})
  //   return upd
  // }

  async getAssignedUserColumns(assignUser: any) {
    const usersColumn = await this.userColumnRepo.find({where: {assignId: assignUser.sub}, relations: {tasks: {
      performer: true,
      do_after: true,
      do_before: true,
      subTask: true
    }}})
    usersColumn.forEach(column => {
      column.newTasks = column.tasks.filter(task => task.status == TaskStatus.ASSIGNED)
      column.processTasks = column.tasks.filter(task => task.status == TaskStatus.PROCESS)
      column.doneTasks = column.tasks.filter(task => task.status == TaskStatus.DONE)
    })
    return usersColumn
  }

  async addSubTask(parentId: number, task: TaskSchema, user: any) {
    const parentTask = await this.taskRepo.findOne({
      where: {
        id: parentId,
      },
    });
    console.log(parentTask);
    
    return await this.taskRepo.save({
      ...task,
      parentTask,
      creatorId: user.sub,
    });
  }

  async getSubTasks(id: number) {
    const parent = await this.taskRepo.findOne({ where: { id } });
    return (
      await this.taskRepo.manager
        .getTreeRepository(TaskSchema)
        .findDescendantsTree(parent)
    ).childrens;
  }

  async testController() {
    const tasks = await this.taskRepo.find();
    tasks.sort((a, b) => {
      
      const coefficientA =
        urgencyCoefficients[Object.values(Urgency).indexOf(a.urgency)] +
        taskComplexityCoefficients[
          Object.values(TaskComplexity).indexOf(a.complexity)
        ] +
        importanceCoefficients[Object.values(Importance).indexOf(a.importance)];

      const coefficientB =
        urgencyCoefficients[Object.values(Urgency).indexOf(b.urgency)] +
        taskComplexityCoefficients[
          Object.values(TaskComplexity).indexOf(b.complexity)
        ] +
        importanceCoefficients[Object.values(Importance).indexOf(b.importance)];

      if (coefficientA > coefficientB) return -1;
      if (coefficientA < coefficientB) return 1;
      
      return 0
    });

    return tasks
  }

  async updateTask(id: number, task: TaskSchema) {
    return await this.taskRepo.update(id, task);
  }

  async updateTaskSection(id: number, section: TaskSectionSchema) {
    return await this.taskSectionRepo.update(id, section);
  }

  async updateTaskSections(columns: TaskSchema[][]) {
    for (let tasks of columns) {
      for (let i = 0; i < tasks.length; i++) {
        await this.taskRepo.update(tasks[i].id, {
          position: i,
          status: tasks[i].status,
          comeToDone: tasks[i].comeToDone,
          comeToProcess: tasks[i].comeToProcess,
          timeInProcess: tasks[i].timeInProcess
        })
      }
    }
  }

  async getTasksTree(creatorId: string) {
    const parents = await this.taskRepo.manager
      .getTreeRepository(TaskSchema)
      .find({ where: { parentId: IsNull(), creatorId } });
    const trees = await Promise.all(
      parents.map(async (parent) => {
        const p = await this.taskRepo.manager
          .getTreeRepository(TaskSchema)
          .findDescendantsTree(parent);
        return p;
      }),
    );
    return trees;
  }

  async deleteTask(taskId: number) {
    return await this.taskRepo.delete({ id: taskId });
  }

  async deleteSection(sectionId: number): Promise<DeleteResult> {
    return await this.taskSectionRepo.delete({ id: sectionId });
  }

  async addFileToTask(file: Express.Multer.File, taskId: number) {
    const fileName = await this.minioService.uploadFile(file)
    const fileUrl = await this.minioService.getFileUrl(fileName)
    let task = await this.taskRepo.findOne({where: {id: taskId}})
    if (task.files) {
      task.files = [...task.files, {fileName, fileUrl}]
    } else {
      task.files = [{fileName, fileUrl}]
    }
    await this.taskRepo.save(task)
    return {
      fileName,
      fileUrl
    }
  }

  async removeFile(fileName: string, taskId: number) {
    const encodedFilename = Buffer.from(fileName).toString('utf8')
    console.log(encodedFilename);
    
    console.log(fileName);
    
    const task = await this.taskRepo.findOne({where: {id: taskId}})
    console.log(task.files);
    await this.minioService.removeFile(encodedFilename)
    task.files = task.files.filter(t => t.fileName !== encodedFilename)
    console.log(task.files);
    
    await this.taskRepo.save(task)
    return task

  }
}
