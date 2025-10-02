import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Task } from '@task-management-take-home/data';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Task Dashboard</h1>
        <button
          (click)="logout()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div
        *ngIf="tasks().length > 0; else noTasks"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          *ngFor="let task of tasks()"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <h3 class="font-bold text-lg">{{ task.title }}</h3>
          <p class="text-gray-600">{{ task.description }}</p>
          <div class="mt-2">
            <span class="text-sm font-semibold">Status:</span> {{ task.status }}
          </div>
          <div class="text-sm">
            <span class="font-semibold">Organization:</span>
            {{ task.organization.name }}
          </div>
        </div>
      </div>
      <ng-template #noTasks>
        <p>No tasks found.</p>
      </ng-template>
    </div>
  `,
})
export class TasksComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  tasks = signal<Task[]>([]);

  ngOnInit() {
    this.http
      .get<Task[]>('http://localhost:3000/api/tasks')
      .subscribe((data: Task[]) => {
        this.tasks.set(data);
      });
  }

  logout() {
    this.authService.logout();
  }
}
