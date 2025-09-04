import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../services/auth.service';
import { PolizaDto } from '../../../interfaces/poliza.models';

@Component({
  selector: 'app-lista-polizas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-polizas.component.html',
  styleUrls: ['./lista-polizas.component.css']
})
export class ListaPolizasComponent implements OnInit {
  private polizaService = inject(PolizaService);
  private authService = inject(AuthService);

  polizas = signal<PolizaDto[]>([]);
  polizasFiltradas = signal<PolizaDto[]>([]);
  loading = signal(true);
  error = signal('');
  
  filtro = '';
  filtroEstado = '';

  ngOnInit(): void {
    this.cargarPolizas();
  }

  cargarPolizas(): void {
    this.loading.set(true);
    this.polizaService.obtenerPolizas().subscribe({
      next: (data) => {
        this.polizas.set(data);
        this.polizasFiltradas.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las pólizas');
        this.loading.set(false);
      }
    });
  }

  aplicarFiltros(): void {
    let filtradas = this.polizas();

    if (this.filtro) {
      const filtroLower = this.filtro.toLowerCase();
      filtradas = filtradas.filter(p => 
        p.numeroPoliza.toLowerCase().includes(filtroLower) ||
        p.clienteNombre.toLowerCase().includes(filtroLower) ||
        p.tipoPoliza.toLowerCase().includes(filtroLower)
      );
    }

    if (this.filtroEstado) {
      filtradas = filtradas.filter(p => p.estado === this.filtroEstado);
    }

    this.polizasFiltradas.set(filtradas);
  }

  autorizarPoliza(id: number): void {
    if (confirm('¿Está seguro de autorizar esta póliza?')) {
      this.polizaService.autorizarPoliza(id).subscribe({
        next: () => {
          this.cargarPolizas();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al autorizar la póliza');
        }
      });
    }
  }

  rechazarPoliza(id: number): void {
    if (confirm('¿Está seguro de rechazar esta póliza?')) {
      this.polizaService.rechazarPoliza(id).subscribe({
        next: () => {
          this.cargarPolizas();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al rechazar la póliza');
        }
      });
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Cotizada': return 'warning';
      case 'Autorizada': return 'success';
      case 'Rechazada': return 'danger';
      default: return 'secondary';
    }
  }

  get userRole(): string {
    return this.authService.userRole();
  }

  canEditOrAuthorize(): boolean {
    return ['Admin', 'Broker'].includes(this.userRole);
  }
}