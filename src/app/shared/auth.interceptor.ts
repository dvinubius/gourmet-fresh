import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchmap';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';

import * as fromAuth from '../authentication/store/auth.reducer';
import { AppState } from '../store/app.reducers';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store
      .select('auth')
      .take(1)
      .switchMap((state: fromAuth.State) => {
        const newReq = req.clone({
          params: req.params.set('auth', state.token),
        });
        return next.handle(newReq);
      });
  }
}
