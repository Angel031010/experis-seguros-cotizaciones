import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearPolizaDto, PolizaDto, ActualizarPolizaDto } from '../interfaces/poliza.models';

@Injectable({
  providedIn: 'root'
})
export class PolizaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.apiUrl}/Polizas`;

  cotizarPoliza(crearPolizaDto: CrearPolizaDto): Observable<PolizaDto> {
    return this.http.post<PolizaDto>(`${this.apiUrl}/cotizar`, crearPolizaDto);
  }

  obtenerPolizas(): Observable<PolizaDto[]> {
    return this.http.get<PolizaDto[]>(this.apiUrl);
  }

  obtenerPolizaDetalle(id: number): Observable<PolizaDto> {
    return this.http.get<PolizaDto>(`${this.apiUrl}/${id}`);
  }

  actualizarPoliza(id: number, actualizarDto: ActualizarPolizaDto): Observable<PolizaDto> {
    return this.http.put<PolizaDto>(`${this.apiUrl}/${id}`, actualizarDto);
  }

  autorizarPoliza(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/autorizar`, {});
  }

  rechazarPoliza(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/rechazar`, {});
  }
}