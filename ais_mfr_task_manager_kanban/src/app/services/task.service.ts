import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { mainURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(
      `${mainURL}/api/task-manager/create-task`,
      task
    );
  }

  updateTask(id: number, data: any): Observable<any> {
    return this.http.patch(
      `${mainURL}/api/task-manager/${id}`,
      data
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(
      `${mainURL}/api/task-manager/delete-task/${id}`
    );
  }

  getSubTasks(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${mainURL}/api/task-manager/sub-tasks/${id}`
    );
  }

  addSubTask(id:number, data: any): Observable<any> {
    return this.http.patch(`${mainURL}/api/task-manager/add-sub-task/${id}`, data) 
  }
}
