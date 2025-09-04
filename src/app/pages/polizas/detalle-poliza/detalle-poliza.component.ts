import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PolizaService } from '../../../services/poliza.service';
import { PolizaDto } from '../../../interfaces/poliza.models';

@Component({
  selector: 'app-detalle-poliza',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-poliza.component.html',
  styleUrls: ['./detalle-poliza.component.css']
})
export class DetallePolizaComponent implements OnInit {
  private polizaService = inject(PolizaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  poliza = signal<PolizaDto | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPoliza(+id);
    }
  }

  cargarPoliza(id: number): void {
    this.loading.set(true);
    this.polizaService.obtenerPolizaDetalle(id).subscribe({
      next: (data) => {
        this.poliza.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar la póliza');
        this.loading.set(false);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'Cotizada': return 'warning';
      case 'Autorizada': return 'success';
      case 'Rechazada': return 'danger';
      default: return 'secondary';
    }
  }

  imprimir(): void {
    window.print();
  }
}