import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  Task,
  Role,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from '@task-management-take-home/data/browser';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  // --- Dependency Injection ---
  public authService = inject(AuthService);
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  // --- State Signals ---
  tasks = signal<Task[]>([]);
  editingTask = signal<Task | null>(null);

  // --- Computed Signals for Columns ---
  todoTasks = computed(() =>
    this.tasks().filter((t) => t.status === TaskStatus.TODO)
  );
  inProgressTasks = computed(() =>
    this.tasks().filter((t) => t.status === TaskStatus.IN_PROGRESS)
  );
  completeTasks = computed(() =>
    this.tasks().filter((t) => t.status === TaskStatus.COMPLETE)
  );

  // --- Expose Enums to Template ---
  TaskStatus = TaskStatus;

  // --- Form Definition ---
  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  constructor() {
    this.loadTasks();
  }

  // --- Data Loading ---
  loadTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks.set(data);
    });
  }

  // --- Drag and Drop Handlers ---
  onDragStart(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('text/plain', task.id.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Necessary to allow dropping
  }

  onDrop(event: DragEvent, newStatus: TaskStatus): void {
    event.preventDefault();
    const taskId = Number(event.dataTransfer?.getData('text/plain'));
    const taskToMove = this.tasks().find((t) => t.id === taskId);

    if (taskToMove && taskToMove.status !== newStatus) {
      this.taskService
        .updateTask(taskId, { status: newStatus })
        .subscribe(() => {
          this.loadTasks();
        });
    }
  }

  // --- UI Actions ---
  startEdit(task: Task): void {
    this.editingTask.set(task);
    this.taskForm.setValue({
      title: task.title,
      description: task.description || '',
    });
  }

  cancelEdit(): void {
    this.editingTask.set(null);
    this.taskForm.reset();
  }

  saveTask(): void {
    if (this.taskForm.invalid) return;

    const taskData = {
      title: this.taskForm.value.title || '',
      description: this.taskForm.value.description || '',
    };

    const currentTask = this.editingTask();

    if (currentTask) {
      this.taskService
        .updateTask(currentTask.id, taskData as UpdateTaskDto)
        .subscribe(() => this.onSaveSuccess());
    } else {
      this.taskService
        .createTask(taskData as CreateTaskDto)
        .subscribe(() => this.onSaveSuccess(true));
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // --- Permission Logic ---
  canModify(task: Task): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    if (user.role === Role.ADMIN) return true;
    if (
      user.role === Role.OWNER &&
      user.organizationId === task.organizationId
    ) {
      return true;
    }
    return false;
  }

  // --- Private Helpers ---
  private onSaveSuccess(resetForm = false): void {
    this.loadTasks();
    this.cancelEdit();
    if (resetForm) {
      this.taskForm.reset();
    }
  }
}
