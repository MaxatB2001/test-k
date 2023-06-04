import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { mainURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<any> {
    return this.http.get(`${mainURL}/api/task-manager/all-tasks`)
  }

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

  setDoAfterTask(beforeTaskId: number, afterTaskId: number) {
    return this.http.post(`${mainURL}/api/task-manager/set-do-after`, {beforeTaskId, afterTaskId})
  }

  uploadFileToTask(formData: FormData, taskId: number):Observable<{fileName: string, fileUrl: string}> {
    return this.http.post<{fileName: string, fileUrl: string}>(`${mainURL}/api/task-manager/add-file-to-task/${taskId}`, formData)
  }

  removeFileFromTask(taskId: number, fileName: string) {
    return this.http.delete(`${mainURL}/api/task-manager/remove-file-from-task/${taskId}/${fileName}`)
  }
}
