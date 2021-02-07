import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const authRoutes: Routes = [
  { path: 'signin', component: SigninComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
