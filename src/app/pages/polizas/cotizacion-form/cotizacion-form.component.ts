import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion-form.component.html',
  styleUrls: ['./cotizacion-form.component.css']
})
export class CotizacionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private polizaService = inject(PolizaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cotizacionForm!: FormGroup;
  loading = signal(false);
  error = signal('');
  isEditMode = signal(false);
  polizaId = signal<number | null>(null);
  
  // Fecha mínima (hoy)
  today = new Date().toISOString().split('T')[0];
  
  tiposPoliza = [
    { id: 1, nombre: 'Vida' },
    { id: 2, nombre: 'Auto' },
    { id: 3, nombre: 'Hogar' },
    { id: 4, nombre: 'Salud' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.polizaId.set(+id);
      this.loadPoliza(+id);
    }
  }

  private initializeForm(): void {
    this.cotizacionForm = this.fb.group({
      tipoPolizaId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      montoPrima: [{ value: '', disabled: true }]
    });
  }

  private loadPoliza(id: number): void {
    this.loading.set(true);
    this.polizaService.obtenerPolizaDetalle(id).subscribe({
      next: (poliza) => {
        // Convertir la fecha correctamente
        const fechaInicio = poliza.fechaInicio ? poliza.fechaInicio.split('T')[0] : '';

        this.cotizacionForm.patchValue({
          tipoPolizaId: this.tiposPoliza.find(t => t.nombre === poliza.tipoPoliza)?.id,
          fechaInicio: fechaInicio,
          montoPrima: poliza.montoPrima
        });
        
        if (this.isEditMode()) {
          this.cotizacionForm.get('montoPrima')?.enable();
        }
        
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la póliza');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.cotizacionForm.invalid) {
      Object.keys(this.cotizacionForm.controls).forEach(key => {
        this.cotizacionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const formValue = this.cotizacionForm.value;

    if (this.isEditMode() && this.polizaId()) {
      // Para actualización, convertir fecha y agregar monto
      const updatePayload = {
        tipoPolizaId: Number(formValue.tipoPolizaId),
        fechaInicio: this.convertirFechaAISO(formValue.fechaInicio),
        montoPrima: Number(formValue.montoPrima)
      };

      this.polizaService.actualizarPoliza(this.polizaId()!, updatePayload).subscribe({
        next: () => {
          this.router.navigate(['/polizas']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.error.set(err.error?.message || 'Error al actualizar la póliza');
          this.loading.set(false);
        }
      });
    } else {
      // Para creación, convertir fecha al formato ISO completo
      const createPayload = {
        tipoPolizaId: Number(formValue.tipoPolizaId),
        fechaInicio: this.convertirFechaAISO(formValue.fechaInicio),
        clienteId: undefined // Solo para clientes que no son el usuario actual
      };

      this.polizaService.cotizarPoliza(createPayload).subscribe({
        next: () => {
          this.router.navigate(['/polizas']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          this.error.set(err.error?.message || 'Error al crear la póliza');
          this.loading.set(false);
        }
      });
    }
  }

  private convertirFechaAISO(fecha: string): string {
    // Convertir fecha del input (yyyy-MM-dd) a ISO string completo
    const fechaObj = new Date(fecha);
    fechaObj.setHours(12, 0, 0, 0); // Mediodía
    return fechaObj.toISOString();
  }

  cancelar(): void {
    this.router.navigate(['/polizas']);
  }

  get userRole(): string {
    return this.authService.userRole();
  }
}