import { Routes} from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'single/:id',
    loadComponent: () =>
      import('./single/single.component').then(m => m.SingleComponent)
  }
];