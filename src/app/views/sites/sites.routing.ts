import { Routes } from '@angular/router';
import {SiteOverviewComponent} from './site-overview/site-overview.component';
import {SettingsComponent } from './ui/settings/settings.component';
import { RoomsComponent } from './ui/rooms/rooms.component';
export const SitesRoutes: Routes = [
  {
    path: '',
    component: SiteOverviewComponent,
    data: { title: 'Overview', breadcrumb: 'OVERVIEW' }
  },
  {
    path : 'smartCtrl',
    component : SettingsComponent,
    data: { title: 'smartControl', breadcrumb: 'SMART-CONTROL'}
  },
  {
    path : 'room',
    component : RoomsComponent,
    data: { title: 'room', breadcrumb: 'ROOM'}
  }
];