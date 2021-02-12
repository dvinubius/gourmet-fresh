import { Component, OnInit } from '@angular/core';
import * as fromAuth from '../store/auth.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: '../login-shared/login.component.html',
  styleUrls: ['../login-shared/login.component.css'],
})
export class SigninComponent implements OnInit {
  entryPoint: string; // a URL : if redirected here because authentication was needed - where to go back after login?
  form: FormGroup;

  serverMessage: string;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.entryPoint = this.route.snapshot.queryParams['entryPoint'] || '';
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
      new fromAuth.AttemptSignin({
        username: email,
        password: password,
        location: this.entryPoint,
      })
    );
  }
}
