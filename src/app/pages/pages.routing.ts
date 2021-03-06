import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule' },
      { path: 'editarOrden', loadChildren: 'app/pages/editarOrden/editarOrden.module#EditarOrdenModule' },
      { path: 'store', loadChildren: 'app/pages/store/store.module#StoreModule' },
      { path: 'manage', loadChildren: 'app/pages/manage/manage.module#ManageModule' },
      { path: 'logout', loadChildren: 'app/pages/logout/logout.module#LogoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
