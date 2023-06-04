import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  constructor() { }

  private isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public isOpen$: Observable<boolean> = this.isOpen.asObservable()

  setIsOpen(bool: boolean) {
    this.isOpen.next(bool)
  }

  private task: BehaviorSubject<Task | null> = new BehaviorSubject<Task | null>(null)
  public task$: Observable<Task | null> = this.task.asObservable()
  public isTaskInCurrentUserColumns = false

  setTask(task: Task | null, isTaskInCurrentUserColumns: boolean) {
    this.isTaskInCurrentUserColumns = isTaskInCurrentUserColumns
    this.task.next(task)
  }
}
