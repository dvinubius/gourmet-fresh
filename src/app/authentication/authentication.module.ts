import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [CommonModule, ReactiveFormsModule, AuthenticationRoutingModule],
  bootstrap: [SigninComponent],
})
export class AuthenticationModule {}
