import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth.component';

const authRoutes: Routes = [
  { path: 'signin', component: LoginComponent, pathMatch: 'full' },
  { path: 'signup', component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
