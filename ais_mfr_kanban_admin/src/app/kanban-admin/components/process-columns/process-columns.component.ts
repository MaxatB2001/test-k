import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'process-column',
  templateUrl: './process-columns.component.html',
  styleUrls: ['./process-columns.component.css']
})
export class ProcessColumnsComponent implements OnInit {
  constructor( private sideBarService: SideBarService) {}
  ngOnInit(): void {
    this.sideBarService.task$.subscribe(openedTask => {
      this.openedTask = openedTask
  })
  }
  @Input() tasks: Task[] = []
  @Input() title!: string
  openedTask!: Task | null



  openSideBar(task: any) {   
    this.sideBarService.setIsOpen(true)
    this.sideBarService.setTask(task, false)
    console.log("openedsub", this.openedTask); 
  }
}
