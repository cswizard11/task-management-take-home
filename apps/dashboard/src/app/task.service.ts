import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
} from '@task-management-take-home/data/browser';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tasks';

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: CreateTaskDto) {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: UpdateTaskDto) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
