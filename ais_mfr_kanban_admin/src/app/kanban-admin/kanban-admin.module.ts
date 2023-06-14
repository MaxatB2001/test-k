import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { KanbanAdminRoutingModule } from './kanban-admin-routing.module';
import { KanbanAdminComponent } from './kanban-admin/kanban-admin.component';
import { TaskColumnComponent } from './task-column/task-column.component';
import {MatIconModule} from '@angular/material/icon';
import { TaskCreatorComponent } from './components/task-creator/task-creator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OuterClickCloseDirective } from './outer-click-close.directive';
import { TaskComponent } from './components/task/task.component';
import { GetTaskColorPipe } from './pipes/get-task-color.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
import { ProcessColumnsComponent } from './components/process-columns/process-columns.component';
import { SubTaskComponent } from './components/sub-task/sub-task.component';
import { GetFileExtensionPipe } from './pipes/get-file-extension.pipe'


@NgModule({
  declarations: [
    KanbanAdminComponent,
    TaskColumnComponent,
    TaskCreatorComponent,
    OuterClickCloseDirective,
    TaskComponent,
    GetTaskColorPipe,
    SideBarComponent,
    ProcessColumnsComponent,
    SubTaskComponent,
    GetFileExtensionPipe,
  ],
  imports: [
    CommonModule,
    KanbanAdminRoutingModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class KanbanAdminModule { }
