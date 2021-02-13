import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import * as fromAuth from '../store/auth.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: '../login-shared/login.component.html',
  styleUrls: ['../login-shared/login.component.css'],
})
export class SignupComponent implements OnInit {
  entryPoint: string; // a URL : if redirected here because authentication was needed - where to go back after login?
  form: FormGroup;

  authError: Observable<string> = this.store.pipe(
    select('auth'),
    map((auth) => auth.authError)
  );

  constructor(private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(new fromAuth.SetAuthError(null));
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
    this.store.dispatch(
      new fromAuth.AttemptSignup({
        username: email,
        password: password,
      })
    );
  }
}
