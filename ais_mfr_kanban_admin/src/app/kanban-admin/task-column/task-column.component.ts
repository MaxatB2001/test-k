import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TaskStatus } from 'src/app/enums/task-status.enum';
import { Task } from 'src/app/models/task.model';
import { DragDropService } from 'src/app/services/drag-drop.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { filterTasks } from 'src/utils/task';

@Component({
  selector: 'app-task-column',
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css'],
})
export class TaskColumnComponent implements OnInit, AfterViewInit {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    public dragDropService: DragDropService
  ) {}
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  ngAfterViewInit(): void {
    if (this.dropList) {
      console.log(this.dropList)
      this.dragDropService.register(this.dropList)
    }
  }
  ngOnInit(): void {
    console.log(this.tasks, "this tasks");
    
    filterTasks(this.tasks);
  }

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.dragDropService.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.dragDropService.currentHoverDropListId;
  }

  changeIsExpanded() {    
    if (this.expandColumns !== undefined) {
      console.log("exp");
      this.expandColumns()
    } else {
      this.user.isTaskExpanded = !this.user.isTaskExpanded;
    }
  }

  showTaskCreator = false;
  @Input() tasks: Task[] = [];
  @Input() index!: string;
  @Input() columnId!: number;
  @Input() user: any;
  @Input() deleteColumn!: (columnId: number) => void;
  @Input() isExpanded: boolean | undefined = false;
  @Input() isWorkColumnsExpanded!: boolean | undefined
  @Input() expandColumns!: () => void
  taskStatusList = TaskStatus
  drop(event: CdkDragDrop<Task[]>) {
    console.log(event);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }


    if (event.container.id == TaskStatus.NEW) {
      let task = event.container.data[event.currentIndex]
      let timeInProcess = 0
      let currentTimeInProcess = 0
      if (task.comeToProcess) {
        timeInProcess = ((new Date()).getTime() - new Date(task.comeToProcess).getTime()) / 1000
      }
      if (task.timeInProcess) {
        currentTimeInProcess = task.timeInProcess
      }
      event.container.data[event.currentIndex] = {...task, status: TaskStatus.NEW, timeInProcess: Math.floor(currentTimeInProcess + timeInProcess)}
      // event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.NEW}
      this.taskService
        .updateTask(event.container.data[event.currentIndex].id as number, {
          performer: null,
          status: TaskStatus.NEW,
        })
        .subscribe((data) => console.log(data));
    }
    if (event.container.id == TaskStatus.PROCESS) {
      event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.PROCESS, comeToProcess: new Date()}
      this.taskService
      .updateTask(event.container.data[event.currentIndex].id as number, {
        status: TaskStatus.PROCESS,
      })
      .subscribe((data) => console.log(data));
    }
    if (event.container.id == TaskStatus.DONE) {
      event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.DONE, comeToDone: new Date()}
      this.taskService
        .updateTask(event.container.data[event.currentIndex].id as number, {
          status: TaskStatus.DONE,
        })
        .subscribe((data) => console.log(data));
    }

    if (event.container.id !== TaskStatus.NEW && event.container.id !== TaskStatus.DONE && event.container.id !== TaskStatus.PROCESS ) {
      console.log("assigned");
      
      this.userService
        .assignTask(
          event.container.id,
          event.container.data[event.currentIndex].id as number
        )
        .subscribe((data) => console.log(data));
    }
  }

  closeCreation() {
    this.showTaskCreator = false;
  }
  createTask(title: string) {
    if (!title) {
      this.showTaskCreator = false;
    } else {
      this.taskService
        .createTask({
          title,
        })
        .subscribe((newTask) => {
          this.tasks?.push(newTask);
          this.showTaskCreator = false;
        });
    }
  }
}
