import { Routes, RouterModule }  from '@angular/router';

import { Manage } from './manage.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Manage
  }
];

export const routing = RouterModule.forChild(routes);
