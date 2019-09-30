import { Routes } from '@angular/router';
import {OverviewComponent} from './ui/overview/overview.component'

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
  }
];