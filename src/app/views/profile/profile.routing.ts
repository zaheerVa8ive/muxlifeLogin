import { Routes } from '@angular/router';
import { EditProfileComponent} from './edit-profile/edit-profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: EditProfileComponent,
      data: { title: 'Edit Profile' }
    }]
  }
];