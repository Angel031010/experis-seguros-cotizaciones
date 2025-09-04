export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  email: string;
  nombre: string;
  rol: string;
  expiracion: Date;
}

export interface ChangePasswordDto {
  passwordActual: string;
  passwordNuevo: string;
  confirmarPassword: string;
}

export interface User {
  email: string;
  nombre: string;
  rol: string;
  token: string;
}
