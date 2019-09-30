import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AppComponent } from './app.component';
import { SigninComponent } from './views/sessions/signin/signin.component';

export const rootRouterConfig: Routes = [
  // { 
  //   path: '', 
  //   // redirectTo: '/sessions/signin', 
  //   component: AppComponent,
  //   pathMatch: 'full' 
  // },

  { 
      path: '', 
      component: SigninComponent,
      pathMatch: 'full' 
  },
  // {
  //   path: '', 
  //   component: AuthLayoutComponent,
  //   children: [
  //     { 
  //       path: 'sessions', 
  //       loadChildren: './views/sessions/sessions.module#SessionsModule',
  //       data: { title: 'Session'} 
  //     }
  //   ]
  // },
  // {
  //   path: '', 
  //   component: AdminLayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: 'edit_profile', 
  //       loadChildren: './views/profile/profile.module#profileModule', 
  //       data: { title: 'Profile', breadcrumb: 'PROFILE'}
  //     }
  //   ]
  // },
  // { 
  //   path: '**', 
  //   redirectTo: 'sessions/404'
  // }
];

