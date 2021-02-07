import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from '../store/auth.reducer';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthEffects {
  attemptedLocation: string;

  // when ATTEMPT_SIGN_UP Action is detected, this @effect makes sure
  // that SIGN_UP and SET_TOKEN Actions will be dispatched
  @Effect()
  authSignup = this.actions$.ofType(AuthActions.ATTEMPT_SIGN_UP).pipe(
    map((action: AuthActions.AttemptSignup) => action.payload),
    switchMap((authData: { username: string; password: string }) =>
      fromPromise(
        this.afAuth.createUserWithEmailAndPassword(
          authData.username,
          authData.password
        )
      )
    ),
    switchMap(async () => (await this.afAuth.currentUser).getIdToken()),
    mergeMap(async (token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthActions.SIGN_UP,
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token,
        },
        {
          type: AuthActions.SET_USER,
          payload: (await this.afAuth.currentUser).email,
        },
      ];
    })
  );

  @Effect()
  authSignin = this.actions$.ofType(AuthActions.ATTEMPT_SIGN_IN).pipe(
    map((action: AuthActions.AttemptSignin) => {
      return action.payload;
    }),
    switchMap(
      (authData: { username: string; password: string; location: string }) => {
        this.attemptedLocation = authData.location;
        return this.afAuth.signInWithEmailAndPassword(
          authData.username,
          authData.password
        );
      }
    ),
    switchMap(async () => {
      return (await this.afAuth.currentUser).getIdToken();
    }),
    mergeMap(async (token: string) => {
      this.router.navigate([this.attemptedLocation], {
        preserveFragment: true,
      });
      return [
        {
          type: AuthActions.SIGN_IN,
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token,
        },
        {
          type: AuthActions.SET_USER,
          payload: (await this.afAuth.currentUser).email,
        },
      ];
    })
  );

  @Effect({ dispatch: false })
  authSignout = this.actions$.ofType(AuthActions.SIGN_OUT).pipe(
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}
}
