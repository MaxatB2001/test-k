import { CdkDrag, CdkDragDrop, CdkDragMove, CdkDragRelease, CdkDropList } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TaskStatus } from 'src/app/enums/task-status.enum';
import { Task } from 'src/app/models/task.model';
import { DragDropService } from 'src/app/services/drag-drop.service';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements AfterViewInit, OnInit {
  constructor(
    private sideBarService: SideBarService,
    public dragDropService: DragDropService,
    private sidebarService: SideBarService
  ) {
  }

  @ViewChild(CdkDropList) dropList?: CdkDropList;
  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList)
    }
  }
  ngOnInit(): void {
    this.sideBarService.task$.subscribe(openedTask => {
        this.openedTask = openedTask
    })
    if (this.task.subTask) {
      this.newSubTasks = this.task.subTask.filter(subTask => subTask.status == TaskStatus.NEW)
    }    
  }
  coefficient: number = 0
  @Input() task!: Task;
  @Input() isCurrentUserColumns!: boolean
  openedTask!: Task | null;
  taskStatusList = TaskStatus
  newSubTasks: Task[] = []

  openSideBar($event: Event) {
    $event.stopPropagation()
    this.sideBarService.setIsOpen(true)
    this.sideBarService.setTask(this.task, this.isCurrentUserColumns)
  }

  drop(event: CdkDragDrop<Task[]>) {
    console.log(event);
  }

  dragMoved(event: CdkDragMove<Task>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
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
}
