import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Importance } from 'src/app/enums/importance.enum';
import { TaskComplexity } from 'src/app/enums/task-complexity.enum';
import { Urgency } from 'src/app/enums/urgency.enum';
import { Task } from 'src/app/models/task.model';
import { ColumnService } from 'src/app/services/column.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { TaskService } from 'src/app/services/task.service';
import { DateHelper } from 'src/utils/date';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, every } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent {
  constructor(
    private taskService: TaskService,
    public sidebarService: SideBarService,
    private columnService: ColumnService
  ) {}
  @ViewChild('dateToggle', { read: ElementRef }) dateToggle!: ElementRef;
  data!: Task;
  showSubTaskCreator: boolean = false;
  newSubTaskTitle: string = '';
  showSubTasks: boolean = false;
  subTasks: Task[] = [];
  importance = Object.values(Importance);
  urgency = Object.values(Urgency);
  complexity = Object.values(TaskComplexity);
  importanceList = Importance;
  urgencyList = Urgency;
  complexityList = TaskComplexity;
  allTasks: Task[] = [];
  filteredAllTasks!: Observable<Task[]>;
  control = new FormControl('');
  subTaskTitle = new FormControl('');

  private _filter(value: string): Task[] {
    const filterValue = this._normalizeValue(value);
    return this.allTasks.filter((task) =>
      this._normalizeValue(task.title).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    this.sidebarService.task$.subscribe((task) => {
      if (task && task.do_before) {
        this.control = new FormControl(task.do_before.title);
        console.log('do_before', task.do_before.title);
      }
      console.log(task);

      this.data = task as Task;
      this.columnService.allTasks$.subscribe((allTasks) => {
        if (this.data) {
          this.allTasks = allTasks.filter(
            (currTask) => currTask.id != this.data.id
          );

          this.filteredAllTasks = this.control.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
          );
        }
      });
    });

    // this.taskSectionListService.taskSectionList$.subscribe(
    //   (data) => (this.taskSectionsList = data)
    // );
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
    this.taskService.deleteTask(this.data.id as number).subscribe((data) => {
      console.log(data);
      this.columnService.deleteTask(this.data);
    });

    // this.taskSectionListService.deleteTaskFromSection(this.data.id as number, this.data.status as string);
    // this.taskService
    //   .deleteTask(this.data.id as number)
    //   .subscribe((data) => this.sidebarService.setIsOpen(false));
  }

  updateImportance(item: Importance) {
    this.taskService
      .updateTask(this.data.id as number, { importance: item })
      .subscribe((data) => (this.data.importance = item));
  }

  updateUrgency(item: Urgency) {
    this.taskService
      .updateTask(this.data.id as number, { urgency: item })
      .subscribe((data) => (this.data.urgency = item));
  }

  updateComplexity(item: TaskComplexity) {
    this.taskService
      .updateTask(this.data.id as number, { complexity: item })
      .subscribe((data) => (this.data.complexity = item));
  }

  getOptionText(option: any) {
    if (!option) {
      return '';
    }
    return option.title;
  }

  optionSelected(value: any) {
    console.log(value.id);
    console.log(this.data);
    this.taskService
      .setDoAfterTask(this.data.id as number, value.id)
      .subscribe((data) => console.log(data));
  }

  addSubTask(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.subTaskTitle.value);
    this.taskService
      .addSubTask(this.data.id as number, {
        title: this.subTaskTitle.value,
        position: 0,
      })
      .subscribe((newSubTask) => {
        this.data.subTask?.push(newSubTask);
        this.subTaskTitle.setValue('');
        this.showSubTaskCreator = false;
      });
  }

  closeSidebar() {
    this.sidebarService.setIsOpen(false);
    this.sidebarService.setTask(null, false);
  }

  fileChange($event: any) {
    console.log($event);
    let fileList: FileList = $event?.target.files;
    if (fileList.length < 1) {
      return;
    }
    let file: File = fileList[0];
    let formData = new FormData();
    formData.append('file', file, file.name);
    if (this.data.id) {
      this.taskService
        .uploadFileToTask(formData, this.data.id)
        .subscribe((data) => {
          this.data.files?.push(data)
        });
    }
  }

  deleteFile(file: { fileName: string; fileUrl: string }) {
    if (this.data.id) {
      this.taskService.removeFileFromTask(this.data.id, file.fileName).subscribe(data => {
        this.data.files = this.data.files?.filter(
          (f) => f.fileName !== file.fileName
        );
      })
    }
  }
}
