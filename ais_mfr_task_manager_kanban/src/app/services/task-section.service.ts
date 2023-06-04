import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskSection } from '../models/task-section.model';
import { Task } from '../models/task.model';
import { mainURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskSectionService {

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any> {
    return this.http.get(`${mainURL}/api/task-manager/assigned-tasks`)
  }

  getUserSections(): Observable<TaskSection[]> {
    return this.http.get<TaskSection[]>(`${mainURL}/api/task-manager/user-sections`)
  }

  createTaskSection(taskSectionTitle: string) {
    return this.http.post<TaskSection>(`${mainURL}/api/task-manager/create-task-section`, {title: taskSectionTitle})
  }

  updateTaskSection(id: number, body: any): Observable<any> {
    return this.http.patch(`${mainURL}/api/task-manager/task-section/${id}`, body)
  }

  updateTaskSections(taskSections: Task[][]) {
    this.http.post(`${mainURL}/api/task-manager/update-task-sections`, taskSections).subscribe()
  }

  deleteTaskSection(id: number): Observable<any>  {
    return this.http.delete(`${mainURL}/api/task-manager/delete-section/${id}`)
  }
}
