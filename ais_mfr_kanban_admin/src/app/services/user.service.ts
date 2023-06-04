import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment, keycloakConfigInfo, mainURL} from "../../environments/environment"
import { UserColumnModel } from '../models/userColumn.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getUsers() {
    return this.http.get(`${keycloakConfigInfo.url}/admin/realms/test-realm/users`)
  }

  createUserColumn(performerKeycloackUser: any): Observable<UserColumnModel> {
    return this.http.post<UserColumnModel>(`${mainURL}/api/task-manager/create-user-column`, {performerKeycloackUser})
  }

  deleteUserColumn(columnId: number) {
    return this.http.delete(`${mainURL}/api/task-manager/delete-user-column/${columnId}`)
  }

  getAssignedColumns(): Observable<UserColumnModel[]> {
    return this.http.get<UserColumnModel[]>(`${mainURL}/api/task-manager/get-assigned-columns`)
  }

  assignTask(performerId: string, taskId: number) {
    return this.http.post(`${mainURL}/api/task-manager/assign-task`, {performerId, taskId})
  }
}
