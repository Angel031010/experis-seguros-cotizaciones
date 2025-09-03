import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { CotizacionFormComponent } from './pages/polizas/cotizacion-form/cotizacion-form.component';
import { ListaPolizasComponent } from './pages/polizas/lista-polizas/lista-polizas.component';
import { DetallePolizaComponent } from './pages/polizas/detalle-poliza/detalle-poliza.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {   path: 'cotizar',
        component: CotizacionFormComponent
    },
    {   path: 'polizas',
        component: ListaPolizasComponent
    },
    {   path: 'polizas/editar/:id',
        component: ListaPolizasComponent 
    },
    {   path: 'polizas/detalle/:id', 
        component: DetallePolizaComponent 
    },
];
