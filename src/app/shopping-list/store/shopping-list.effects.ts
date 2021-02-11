import { Injectable } from '@angular/core';
import * as fromShoppingList from '../store/shopping-list.reducer';
import { Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { FeatureState } from '../store/shopping-list.reducer';
import { Store, select } from '@ngrx/store';

import { withLatestFrom, switchMap, map } from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';
import { Ingredient } from '../../shared/ingredient.model';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<FeatureState>,
    private appStore: Store<AppState>
  ) {}

  @Effect({ dispatch: false })
  recipesStore = this.actions$.pipe(
    ofType(
      fromShoppingList.ADD_INGREDIENT,
      fromShoppingList.ADD_INGREDIENTS,
      fromShoppingList.DELETE_INGREDIENT,
      fromShoppingList.UPDATE_INGREDIENT
    ),
    withLatestFrom(
      this.store.pipe(select('ingredients')),
      this.appStore.pipe(select('auth'))
    ),
    map(([_, shoppingListState, authState]) => [
      authState.token,
      authState.uid,
      shoppingListState,
    ]),
    switchMap(
      ([token, uid, state]: [string, string, fromShoppingList.State]) => {
        const fragment = uid ?? 'demo';
        const params = !!uid ? { auth: token } : {};
        return this.httpClient.put(
          `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/shopping-list.json`,
          state.ingredients,
          {
            reportProgress: true,
            params,
          }
        );
      }
    )
  );

  @Effect()
  recipesFetch = this.actions$.pipe(
    ofType(fromShoppingList.FETCH_INGREDIENTS),
    withLatestFrom(this.appStore.pipe(select('auth'))),
    map(([_, authState]) => [authState.uid, authState.token]),
    switchMap(([uid, token]: [string, string]) => {
      const fragment = uid ?? 'demo';
      const params = !!uid ? { auth: token } : {};
      return this.httpClient.get<Ingredient[]>(
        `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/shopping-list.json`,
        {
          params,
        }
      );
    }),
    map((ingredients) => {
      return {
        type: fromShoppingList.SET_INGREDIENTS,
        payload: ingredients ?? [],
      };
    })
  );
}
