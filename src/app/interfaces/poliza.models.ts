export interface CrearPolizaDto {
  tipoPolizaId: number;
  fechaInicio: string;
  clienteId?: string;
}

export interface ActualizarPolizaDto {
  tipoPolizaId: number;
  fechaInicio: string;
  montoPrima: number;
}

export interface PolizaDto {
  id: number;
  numeroPoliza: string;
  fechaInicio: string;
  fechaFin: string;
  montoPrima: number;
  estado: string;
  fechaCreacion: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  tipoPoliza: string;
}