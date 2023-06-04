import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskSection } from '../models/task-section.model';
import { TaskSectionService } from '../services/task-section.service';
import { finalize } from 'rxjs';
import { AllTasks, TaskSectionsListService } from '../services/task-sections-list.service';
import { SideBarService } from '../services/side-bar.service';
import { TaskStatus } from './enums/task-status.enum';
import { addCoefficientToTask } from 'src/utils/task';
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KanbanComponent implements OnInit {
  constructor(
    private taskSectionService: TaskSectionService,
    private taskSectionListService: TaskSectionsListService,
    private sideBarService: SideBarService
  ) {}
  opened = false
  taskSections: AllTasks = {doneTasks: [], processTasks: [], newTasks: []};
  error: string = '';
  isLoading: boolean = false;
  showSectionCreation: boolean = false;
  taskStatusList = TaskStatus

  ngOnInit(): void {
    this.sideBarService.isOpen$.subscribe((isOpen) => {
      this.opened = isOpen
    })
    this.taskSectionListService.taskSectionList$.subscribe((list) => {
      this.taskSections = list
      console.log("list");
      
      addCoefficientToTask([...list.newTasks, ...list.doneTasks, ...list.processTasks])
    });
    this.taskSectionListService.loader$.subscribe((bool) => this.isLoading = bool)
    this.taskSectionListService.getUSerSections();
  }

  openSectionCreation() {
    this.showSectionCreation = true;
  }

  closeSectionCreation($event: Event) {
    $event.stopPropagation();
    this.showSectionCreation = false;
  }
}
