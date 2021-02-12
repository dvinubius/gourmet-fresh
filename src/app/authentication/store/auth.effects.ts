import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as AuthActions from '../store/auth.reducer';
import { map, switchMap, mergeMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Signup, SetToken, SetUser } from './auth.reducer';
import * as RecipeActions from '../../recipes/store/recipe.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.reducer';

@Injectable()
export class AuthEffects {
  attemptedLocation: string;

  // when ATTEMPT_SIGN_UP Action is detected, this @effect makes sure
  // that SIGN_UP and SET_TOKEN Actions will be dispatched
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.ATTEMPT_SIGN_UP),
    map((action: AuthActions.AttemptSignup) => action.payload),
    switchMap((authData: { username: string; password: string }) =>
      this.afAuth.createUserWithEmailAndPassword(
        authData.username,
        authData.password
      )
    ),
    catchError((e) => {
      alert('Error while signing up: ' + e.message);
      return e;
    }),
    switchMap(async () => {
      const usr = await this.afAuth.currentUser;
      return {
        token: await usr.getIdToken(),
        email: usr.email,
        uid: usr.uid,
      };
    }),
    mergeMap(({ token, email, uid }) => {
      this.router.navigate(['/']);
      return [new Signup(), new SetToken(token), new SetUser({ email, uid })];
    })
  );

  @Effect()
  authSignin = this.actions$.pipe(
    ofType(AuthActions.ATTEMPT_SIGN_IN),
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
      const usr = await this.afAuth.currentUser;
      return {
        token: await usr.getIdToken(),
        email: usr.email,
        uid: usr.uid,
      };
    }),
    mergeMap(({ token, email, uid }) => {
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
          payload: { email, uid },
        },
        {
          type: RecipeActions.FETCH_RECIPES,
        },
      ];
    })
  );

  @Effect({ dispatch: false })
  authSignout = this.actions$.pipe(
    ofType(AuthActions.SIGN_OUT),
    tap(async () => {
      this.router.navigate(['/']);
      await this.afAuth.signOut();
      this.store.dispatch(new RecipeActions.FetchRecipes());
      this.store.dispatch(new ShoppingListActions.FetchIngredients());
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private afAuth: AngularFireAuth,
    private store: Store<AppState>
  ) {}
}
