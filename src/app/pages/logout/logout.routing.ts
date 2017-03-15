import { Routes, RouterModule }  from '@angular/router';

import { Logout } from './logout.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Logout
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
