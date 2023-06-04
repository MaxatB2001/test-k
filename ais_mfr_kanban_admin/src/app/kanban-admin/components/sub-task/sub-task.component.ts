import { Component, Input, OnInit } from '@angular/core';
import { TaskStatus } from 'src/app/enums/task-status.enum';
import { Task } from 'src/app/models/task.model';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.css']
})
export class SubTaskComponent implements OnInit {
  constructor(private sidebarService: SideBarService) {}
  taskStatusList = TaskStatus
  ngOnInit(): void {
    console.log(this.task);
  }

  setCurrentTask() {
    this.sidebarService.setTask(this.task, false)
  }
  @Input() task!: Task
}
