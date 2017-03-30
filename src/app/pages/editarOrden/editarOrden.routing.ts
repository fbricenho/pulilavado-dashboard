import { Routes, RouterModule }  from '@angular/router';

import { EditarOrden } from './editarOrden.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: EditarOrden,
    children: []
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
