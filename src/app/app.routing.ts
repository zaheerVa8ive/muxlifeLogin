import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AppComponent } from './app.component';
import { SigninComponent } from './views/sessions/signin/signin.component';

export const rootRouterConfig: Routes = [
  { 
      path: ':state', 
      component: SigninComponent,
      pathMatch: 'full' 
  }
];

