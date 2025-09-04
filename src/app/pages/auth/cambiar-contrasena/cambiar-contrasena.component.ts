import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  passwordForm: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal(false);
  showPasswords = {
    actual: false,
    nuevo: false,
    confirmar: false
  };

  constructor() {
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNuevo: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('passwordNuevo');
    const confirmPassword = form.get('confirmarPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set(false);

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.success.set(true);
        this.passwordForm.reset();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/polizas']);
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cambiar la contraseña');
        this.loading.set(false);
      }
    });
  }

  togglePasswordVisibility(field: 'actual' | 'nuevo' | 'confirmar'): void {
    this.showPasswords[field] = !this.showPasswords[field];
  }
}