import { Component, Input, OnInit } from '@angular/core';
import { TaskSection } from 'src/app/models/task-section.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/services/task.service';
import { TaskSectionService } from 'src/app/services/task-section.service';
import { AllTasks, TaskSectionsListService } from 'src/app/services/task-sections-list.service';
import { Urgency } from '../../enums/urgency.enum';
import { TaskComplexity } from '../../enums/task-complexity.enum';
import { Importance } from '../../enums/importance.enum';
import { getDifferenceInDays } from 'src/utils/date';
import { importanceCoefficients, taskComplexityCoefficients, urgencyCoefficients } from 'src/data/coefficients';
import { countCoeffiicient, filterTasks } from 'src/utils/task';
import { Task } from 'src/app/models/task.model';
import { TaskStatus } from '../../enums/task-status.enum';

@Component({
  selector: 'task-section',
  templateUrl: './task-section.component.html',
  styleUrls: ['./task-section.component.css'],
})
export class TaskSectionComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private taskSectionService: TaskSectionService,
    private taskSectionListService: TaskSectionsListService
  ) {}
  ngOnInit(): void {
    console.log("test");
    
    this.taskSectionListService.taskSectionList$.subscribe(data => {
      this.columns = data
      // this.allTasks.push(...data.newTasks, ...data.doneTasks, ...data.processTasks)
    })
    filterTasks(this.tasks) 
  }

  @Input() tasks!: Task[];
  @Input() index!: string
  private allTasks:Task[] = []
  columns!: AllTasks
  showTaskCreator: boolean = false;
  taskStatusList = TaskStatus

  isTitleWritable: Boolean = false;

  drop(event: CdkDragDrop<Task[]>) {
    console.log(event);
    
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // this.taskSectionService.updateTaskSections([event.container.data]);
    } else {
      if (event.currentIndex == 2 && event.container.id == TaskStatus.PROCESS) {
        return 
      } 
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.data.length == 3 && event.container.id == TaskStatus.PROCESS) {
          transferArrayItem(
            event.container.data,
            this.columns.newTasks,
            2,
            0
          )
          this.columns.newTasks[0] = {...this.columns.newTasks[0], status: TaskStatus.ASSIGNED}
          event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.PROCESS, comeToProcess: new Date()}
          console.log(this.columns.newTasks);
          console.log(event.container.data);
        
        
        this.taskSectionService.updateTaskSections([
          this.columns.newTasks,
          event.container.data,
        ]);
        return
      }
      
      // if (event.container.id == TaskStatus.PROCESS && event.previousContainer.id == TaskStatus.ASSIGNED && event.container.data.length == 2) {
      //   event.previousContainer.data[0] = {...event.previousContainer.data[0], status: TaskStatus.ASSIGNED}
      // }

      if (event.container.id == TaskStatus.ASSIGNED) {
        let task = event.container.data[event.currentIndex]
        let timeInProcess = 0
        let currentTimeInProcess = 0
        if (task.comeToProcess) {
          timeInProcess = ((new Date()).getTime() - new Date(task.comeToProcess).getTime()) / 1000
        }
        if (task.timeInProcess) {
          currentTimeInProcess = task.timeInProcess
        }
        event.container.data[event.currentIndex] = {...task, status: TaskStatus.ASSIGNED, timeInProcess: Math.floor(currentTimeInProcess + timeInProcess)}
        // event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.NEW}
      }
      if (event.container.id == TaskStatus.PROCESS) {
        event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.PROCESS, comeToProcess: new Date()}
      }
      if (event.container.id == TaskStatus.DONE) {
        event.container.data[event.currentIndex] = {...event.container.data[event.currentIndex], status: TaskStatus.DONE, comeToDone: new Date()}
      }
      this.taskSectionService.updateTaskSections([
        event.previousContainer.data,
        event.container.data,
      ]);
    }
  }

  createTask(title: string) {
    if (!title) {
      this.showTaskCreator = false;
    } else {
      this.taskService
      .createTask({
        title,
      })
      .subscribe((newTask) => {
        this.tasks?.push(newTask);
        this.showTaskCreator = false;
      });
    }
  }

  deleteSectionHandler() {
  }

  loge(e: any) {
    console.log(e)
  }

  sortByPriority() {
    // const today = new Date()
    // // filterTasks(this.taskSection.tasks)
    // console.log(this.taskSection.tasks);
    
    // this.taskSection.tasks.sort((a, b) => {
      
    //   const coefficientA = countCoeffiicient(a)
        
    //   const coefficientB = countCoeffiicient(b)
      
    //   if (coefficientA > coefficientB) return -1;
    //   if (coefficientA < coefficientB) return 1;
      
    //   return 0
    // })
  }

  openTitleUpdate() {
    this.isTitleWritable = true;
  }

  closeTitleUpdate() {
    this.isTitleWritable = false;
  }

  openCreation() {
    this.showTaskCreator = true;
  }

  closeCreation() {
    this.showTaskCreator = false;
  }
}