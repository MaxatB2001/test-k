import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';
import { UserService } from './user.service';
import { UserColumnModel } from '../models/userColumn.model';
import { AllTasks } from '../kanban-admin/kanban-admin/kanban-admin.component';
import { addCoefficientToTask } from 'src/utils/task';
import { TaskStatus } from '../enums/task-status.enum';
import { SideBarService } from './side-bar.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnService {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private sidebarService: SideBarService
  ) {}

  private newTasks: BehaviorSubject<AllTasks> = new BehaviorSubject<AllTasks>({
    newTasks: [],
    processTasks: [],
    doneTasks: [],
  });
  public newTasks$: Observable<AllTasks> = this.newTasks.asObservable();

  private userColumns: BehaviorSubject<UserColumnModel[]> = new BehaviorSubject<
    UserColumnModel[]
  >([]);
  public userColumns$: Observable<UserColumnModel[]> =
    this.userColumns.asObservable();

  
  private allTasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public allTasks$: Observable<Task[]> = this.allTasks.asObservable() 

  getColumns() {
    this.taskService.getAllTasks().subscribe((data) => {
      console.log("all", data);
      this.newTasks.next(data);
      this.userService.getAssignedColumns().subscribe((userC) => {
        this.userColumns.next(userC);
        let usersTasks: Task[] = [];
        this.userColumns.value.forEach((u) => {
          usersTasks = usersTasks.concat(u.newTasks, u.processTasks, u.doneTasks);
        });
        console.log(userC);
        this.allTasks.next([...this.newTasks.value.newTasks,...this.newTasks.value.processTasks, ...this.newTasks.value.doneTasks,...usersTasks])
        addCoefficientToTask([...this.newTasks.value.newTasks,...this.newTasks.value.processTasks, ...this.newTasks.value.doneTasks,...usersTasks]);
      });
    });
  }

  updateColumns() {}

  deleteTask(task: Task) {
    console.log(this.sidebarService.isTaskInCurrentUserColumns);
    if (this.sidebarService.isTaskInCurrentUserColumns) {
      if (task.status == TaskStatus.NEW || task.status == TaskStatus.ASSIGNED) {
        this.newTasks.next({...this.newTasks.value, newTasks: this.newTasks.value.newTasks.filter(t => t.id !== task.id)})
      }
      if (task.status == TaskStatus.PROCESS) {
        this.newTasks.next({...this.newTasks.value, processTasks: this.newTasks.value.processTasks.filter(t => t.id !== task.id)})
      }

      if (task.status == TaskStatus.DONE) {
        this.newTasks.next({...this.newTasks.value, doneTasks: this.newTasks.value.doneTasks.filter(t => t.id !== task.id)})
      }
      return
    }
    
    let updated: UserColumnModel[] = [];
    if (task.status == TaskStatus.ASSIGNED) {
      updated = this.userColumns.value.map(c => {
        if (c.id == task.performer?.id) {
          c.newTasks = c.newTasks.filter(t => t.id !== task.id)
        }
        return c
      })
    }
    if (task.status == TaskStatus.PROCESS) {
      updated = this.userColumns.value.map(c => {
        if (c.id == task.performer?.id) {
          c.processTasks = c.processTasks.filter(t => t.id !== task.id)
        }
        return c
      })
    }
    if (task.status == TaskStatus.DONE) {
      updated = this.userColumns.value.map(c => {
        if (c.id == task.performer?.id) {
          c.doneTasks = c.doneTasks.filter(t => t.id !== task.id)
        }
        return c
      })
    }


    console.log("upd", updated);
    
    this.userColumns.next(updated);
  }
}
