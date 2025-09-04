import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'cambiar-contrasena',
        loadComponent: () => import('./pages/auth/cambiar-contrasena/cambiar-contrasena.component').then(m => m.CambiarContrasenaComponent),
        canActivate: [authGuard]
    },
    {   
        path: 'cotizar',
        loadComponent: () => import('./pages/polizas/cotizacion-form/cotizacion-form.component').then(m => m.CotizacionFormComponent),
        canActivate: [authGuard]
    },
    {   
        path: 'polizas',
        loadComponent: () => import('./pages/polizas/lista-polizas/lista-polizas.component').then(m => m.ListaPolizasComponent),
        canActivate: [authGuard]
    },
    {   
        path: 'polizas/editar/:id',
        loadComponent: () => import('./pages/polizas/cotizacion-form/cotizacion-form.component').then(m => m.CotizacionFormComponent),
        canActivate: [authGuard],
        data: { 
            mode: 'edit',
            requiredRoles: ['Admin', 'Broker']
        }
    },
    {   
        path: 'polizas/detalle/:id', 
        loadComponent: () => import('./pages/polizas/detalle-poliza/detalle-poliza.component').then(m => m.DetallePolizaComponent),
        canActivate: [authGuard]
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/polizas/lista-polizas/lista-polizas.component').then(m => m.ListaPolizasComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];