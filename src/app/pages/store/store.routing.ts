import { Routes, RouterModule }  from '@angular/router';

import { Store } from './store.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Store
  }
];

export const routing = RouterModule.forChild(routes);
