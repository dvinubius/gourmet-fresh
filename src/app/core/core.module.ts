import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorPageComponent } from './error-page/error-page.component';

import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { AuthenticationRoutingModule } from '../authentication/authentication-routing.module';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [HeaderComponent, WelcomeComponent, ErrorPageComponent, AboutComponent],
  imports: [ReactiveFormsModule, SharedModule, RouterModule],
  exports: [HeaderComponent, WelcomeComponent, ErrorPageComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ],
})
export class CoreModule {}
