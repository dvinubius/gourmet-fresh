import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { take, switchMap } from 'rxjs/operators';

import * as fromAuth from '../authentication/store/auth.reducer';
import { AppState } from '../store/app.reducers';
import { Store, select } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select('auth'),
      take(1),
      switchMap((state: fromAuth.State) => {
        const newReq = req.clone(
          state.token
            ? {
                params: req.params.set('auth', state.token),
              }
            : {}
        );
        return next.handle(newReq);
      })
    );
  }
}
