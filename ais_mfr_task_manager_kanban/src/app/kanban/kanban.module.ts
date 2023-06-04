import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KanbanRoutingModule } from './kanban-routing.module';
import { KanbanComponent } from './kanban.component';
import { TaskComponent } from './components/task/task.component';
import { TaskSectionComponent } from './components/task-section/task-section.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskCreatorComponent } from './components/task-creator/task-creator.component';
import { FormsModule } from '@angular/forms';
// import { TaskSectionCreatorComponent } from './components/task-section-creator/task-section-creator.component';
import {MatDatepickerModule} from "@angular/material/datepicker"
import {MatNativeDateModule} from "@angular/material/core"
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AutofocusDirective } from './directives/auto-focus-directive.directive';
import { OuterClickCloseDirective } from './directives/outer-click-close.directive';
import {MatDialogModule} from '@angular/material/dialog';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { GetTaskColorPipe } from './pipes/get-task-color.pipe';

@NgModule({
  declarations: [
    KanbanComponent,
    TaskComponent,
    TaskSectionComponent,
    TaskCreatorComponent,
    AutofocusDirective,
    OuterClickCloseDirective,
    TaskDialogComponent,
    TaskStatusComponent,
    GetTaskColorPipe,
  ],
  exports: [TaskComponent, TaskSectionComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    KanbanRoutingModule,
    DragDropModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptorService,
    //   multi: true
    // }
  ],
  // bootstrap: [KanbanComponent]
})
export class KanbanModule { }
