import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { TaskStatus } from 'src/app/enums/task-status.enum';
import { Task } from 'src/app/models/task.model';
import { UserColumnModel } from 'src/app/models/userColumn.model';
import { ColumnService } from 'src/app/services/column.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { addCoefficientToTask } from 'src/utils/task';

export interface AllTasks {
  newTasks: Task[];
  processTasks: Task[];
  doneTasks: Task[];
}

@Component({
  selector: 'app-kanban-admin',
  templateUrl: './kanban-admin.component.html',
  styleUrls: ['./kanban-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KanbanAdminComponent implements OnInit{
  allTasks: AllTasks = {newTasks: [], processTasks: [], doneTasks: []}
  users: Array<{firstName: string, newTasks: Task[], doneTasks: Task[], processTasks: Task[]}> = []
  myControl = new FormControl('')
  filteredOptions!: Observable<any[]>;
  userAssignedColumns: UserColumnModel[] = []
  opened = false
  isWorkColumnsExpanded: boolean = false
  taskStatusList = TaskStatus

  constructor(private taskService: TaskService, private userService: UserService, private sideBarService: SideBarService, private columnService: ColumnService) {}
  ngOnInit(): void {
    this.columnService.newTasks$.subscribe(data => {
      this.allTasks = data
      console.log("all_tasks", data)
    })
    this.columnService.userColumns$.subscribe(data => {
      this.userAssignedColumns = data
      console.log("users", data)
    })
    this.columnService.getColumns()
    this.sideBarService.isOpen$.subscribe((isOpen) => {
      this.opened = isOpen
    })
    this.userService.getUsers().subscribe(data => {
      this.users = data as []   
      console.log(data);
      
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    })
    
  }

  expandColumns() {    
    this.isWorkColumnsExpanded = !this.isWorkColumnsExpanded
  }

  _filter = (value: any) => {
    const filterValue = value.toLowerCase();    
    return this.users.filter(user => user.firstName.toLowerCase().includes(filterValue));
  }  

  getOptionText(option: any) {
    if (!option) {
      return ""
    }
    return option.firstName + " " + option.lastName
  }

  addUserColumn = (value: any) => {
    this.userService.createUserColumn(value).subscribe(data => {
      console.log(data);
      
      this.userAssignedColumns = [...this.userAssignedColumns, {...data, tasks: []}] 
      this.myControl.setValue("")
    })
  }

  deleteUserColumn = (columnId: number) => {
    this.userService.deleteUserColumn(columnId).subscribe(data => {
      this.userAssignedColumns = this.userAssignedColumns.filter(col => col.id !== columnId)
    })
  }
}
