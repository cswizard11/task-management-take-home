import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginDto } from '@task-management-take-home/data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage.set(null);
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as LoginDto).subscribe({
        error: (err) => {
          this.errorMessage.set(
            err.error?.message || 'Login failed. Please check your credentials.'
          );
          console.error('Login error:', err);
        },
      });
    }
  }
}
