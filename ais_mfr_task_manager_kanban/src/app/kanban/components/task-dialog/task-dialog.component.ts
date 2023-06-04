import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskSection } from 'src/app/models/task-section.model';
import { Task } from 'src/app/models/task.model';
import { TaskSectionsListService } from 'src/app/services/task-sections-list.service';
import { TaskService } from 'src/app/services/task.service';
import { DateHelper } from 'src/utils/date';
import { Importance } from '../../enums/importance.enum';
import { Urgency } from '../../enums/urgency.enum';
import { TaskComplexity } from '../../enums/task-complexity.enum';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private taskSectionListService: TaskSectionsListService,
    public sidebarService: SideBarService
  ) {}
  @ViewChild('dateToggle', { read: ElementRef }) dateToggle!: ElementRef;
  data!: Task
  taskSectionsList: TaskSection[] = [];
  showSubTaskCreator: boolean = false;
  newSubTaskTitle: string = '';
  showSubTasks: boolean = false;
  subTasks: Task[] = [];
  importance = Object.values(Importance)
  urgency = Object.values(Urgency)
  complexity = Object.values(TaskComplexity)
  importanceList = Importance
  urgencyList = Urgency
  complexityList = TaskComplexity

  ngOnInit(): void {
    this.sidebarService.task$.subscribe(task => this.data = task as Task)
    this.taskSectionListService.taskSectionList$.subscribe(
      // (data) => (this.taskSectionsList = data)
    );
  }

  format(date: Date | undefined) {
    return DateHelper.format(date as Date);
  }

  triggerDateChoose($event: Event) {
    $event.stopPropagation();
    let el: HTMLElement = this.dateToggle.nativeElement;
    el.click();
  }

  onDateChangeDeadline($event: MatDatepickerInputEvent<Date>) {
    this.data.deadline = $event.value as Date;
    this.taskService
      .updateTask(this.data.id as number, { deadline: $event.value })
      .subscribe((data) => console.log(data));
  }
  onDateChangeStart($event: MatDatepickerInputEvent<Date>) {
    this.data.created_at = $event.value as Date;
    this.taskService
      .updateTask(this.data.id as number, { created_at: $event.value })
      .subscribe((data) => console.log(data));
  }

  updateTaskValue(key: string, value: string | null | number) {
    const data: any = {};
    data[key] = value;
    this.taskService
      .updateTask(this.data.id as number, data)
      .subscribe((data) => console.log(data));
  }

  removeStartDate() {
    this.updateTaskValue('created_at', null);
    this.data.created_at = undefined;
  }

  removeDeadline() {
    this.updateTaskValue('deadline', null);
    this.data.deadline = undefined;
  }

  deleteHandler() {
    this.taskSectionListService.deleteTaskFromSection(this.data.id as number, this.data.status as string);
    this.taskService
      .deleteTask(this.data.id as number)
      .subscribe((data) => this.sidebarService.setIsOpen(false));
  }

  addSubTask() {
    if (this.data.id) {
      this.taskService
        .addSubTask(this.data.id, {
          title: this.newSubTaskTitle,
          position: 0,
        })
        .subscribe((data) => this.subTasks.push(data));
    }
    this.newSubTaskTitle = ""
  }

  updateImportance(item: Importance) {
    this.taskService.updateTask(this.data.id as number, {importance: item}).subscribe(data => this.data.importance = item)
  }

  updateUrgency(item: Urgency) {
    this.taskService.updateTask(this.data.id as number, {urgency: item}).subscribe(data => this.data.urgency = item)
  }

  updateComplexity(item: TaskComplexity) {
    this.taskService.updateTask(this.data.id as number, {complexity: item}).subscribe(data => this.data.complexity = item)
  }
}
