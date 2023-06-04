import { Injectable } from '@angular/core';
import { TaskSectionService } from './task-section.service';
import { TaskSection } from '../models/task-section.model';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskStatus } from '../kanban/enums/task-status.enum';

export interface AllTasks {
  newTasks: Task[];
  processTasks: Task[];
  doneTasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class TaskSectionsListService {
  constructor(private taskSectionService: TaskSectionService) {}

  private taskSectionList: BehaviorSubject<AllTasks> = new BehaviorSubject<
    AllTasks
  >({newTasks: [], processTasks: [], doneTasks: []});
  public taskSectionList$: Observable<AllTasks> =
    this.taskSectionList.asObservable();
  private loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public loader$: Observable<boolean> = this.loader.asObservable();

  getUSerSections() {
    this.loader.next(true);
    this.taskSectionService
      .getAllTasks()
      .pipe(finalize(() => this.loader.next(false)))
      .subscribe((data) => this.taskSectionList.next(data));
  }

  deleteTaskFromSection(taskId: number, sectionId: string) {
    let updated;  
    if (sectionId == TaskStatus.NEW) {
      updated = {...this.taskSectionList.value, newTasks: this.taskSectionList.value.newTasks.filter(task => task.id !== taskId)}
      this.taskSectionList.next(updated) 
    }
    if (sectionId == TaskStatus.PROCESS) {
      updated = {...this.taskSectionList.value, processTasks: this.taskSectionList.value.processTasks.filter(task => task.id !== taskId)}
      this.taskSectionList.next(updated) 
    }
    if (sectionId == TaskStatus.DONE) {
      updated = {...this.taskSectionList.value, doneTasks: this.taskSectionList.value.doneTasks.filter(task => task.id !== taskId)}
      this.taskSectionList.next(updated) 
    }
  }

  // updateTaskSectionList(updatedList: TaskSection[]) {
  //   this.taskSectionList.next(updatedList);
  // }
}
