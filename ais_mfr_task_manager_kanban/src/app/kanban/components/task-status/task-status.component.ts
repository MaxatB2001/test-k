import { Component, Input } from '@angular/core';
import { TaskStatus } from '../../enums/task-status.enum';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent {
  constructor(private taskService: TaskService) {}
  @Input() task!: Task
  statusList = TaskStatus
  values = Object.values(TaskStatus)

  updateStatus(status: TaskStatus) {
    if (this.task.status !== status) {
      this.taskService.updateTask(this.task.id as number, {status}).subscribe(data => this.task.status = status)
    }
  }
}
