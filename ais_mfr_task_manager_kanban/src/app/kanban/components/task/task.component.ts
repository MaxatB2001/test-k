import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { countCoeffiicient } from 'src/utils/task';
import { TaskStatus } from '../../enums/task-status.enum';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  constructor(
    private dateAdapter: DateAdapter<Date>,
    private taskService: TaskService,
    public dialog: MatDialog,
    private sideBarService: SideBarService
  ) {
    this.dateAdapter.setLocale('ru');
  }
  ngOnInit(): void {
    // this.coefficient = countCoeffiicient(this.task);
    
  }
  statusList = TaskStatus
  coefficient: number = 0
  @Input() task!: Task;
  @ViewChild('dateToggle', { read: ElementRef }) dateToggle!: ElementRef;

  triggerDateChoose($event: Event) {
    $event.stopPropagation();
    let el: HTMLElement = this.dateToggle.nativeElement;
    el.click();
  }

  onDateChange($event: MatDatepickerInputEvent<Date>) {
    this.task.deadline = $event.value as Date;
    this.taskService
      .updateTask(this.task.id as number, { deadline: $event.value })
      .subscribe((data) => console.log(data));
  }

  format(date: Date) {
    const d = new Date(date);
    return d.toLocaleDateString('ru', {
      month: 'long',
      day: 'numeric',
    });
  }

  openSideBar() {
    this.sideBarService.setIsOpen(true)
    this.sideBarService.setTask(this.task)
  }
}
