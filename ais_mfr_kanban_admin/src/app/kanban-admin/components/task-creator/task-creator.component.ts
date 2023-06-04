import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.css']
})
export class TaskCreatorComponent {
  constructor(private el: ElementRef) {}

  taskTitle: string = '';

  @Input() close!: () => void

  @Input() createTask!: (title: string) => void;
}
