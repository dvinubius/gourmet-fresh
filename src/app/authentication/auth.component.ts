import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../store/app.reducers';
import { ActivatedRoute } from '@angular/router';
import * as fromAuth from './store/auth.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class LoginComponent implements OnInit {
  entryPoint: string; // a URL : if redirected here because authentication was needed - where to go back after login?
  form: FormGroup;

  authError: Observable<string> = this.store.pipe(
    select('auth'),
    map((auth) => auth.authError)
  );

  isSignIn: boolean;
  get title() {
    return this.isSignIn ? 'Sign In' : 'Sign Up';
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isSignIn = this.route.snapshot.url[0].path === 'signin';
    this.store.dispatch(new fromAuth.SetAuthError(null));
    if (this.isSignIn) {
      this.entryPoint = this.route.snapshot.queryParams['entryPoint'] || '';
    }
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  async onSubmit() {
    const email = this.email.value;
    const password = this.password.value;
    const event = this.isSignIn
      ? new fromAuth.AttemptSignin({
          username: email,
          password: password,
          location: this.entryPoint,
        })
      : new fromAuth.AttemptSignup({
          username: email,
          password: password,
        });
    this.store.dispatch(event);
  }

  loginAsGuest() {
    this.store.dispatch(
      new fromAuth.AttemptSignin({
        username: 'guest@home.com',
        password: 'guest@home.com',
        location: this.entryPoint,
      })
    );
  }
}
