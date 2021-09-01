import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleComponent } from './single/single.component';


const routes: Routes = [
  {path: 'single/:id', component: SingleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
