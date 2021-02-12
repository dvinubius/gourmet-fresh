import { Injectable } from '@angular/core';
import * as fromShoppingList from '../store/shopping-list.reducer';
import { Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { FeatureState } from '../store/shopping-list.reducer';
import { Store, select } from '@ngrx/store';

import { withLatestFrom, switchMap, map, filter } from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';
import { Ingredient } from '../../shared/ingredient.model';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
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
      this.appStore.pipe(select('shoppingList')),
      this.appStore.pipe(select('auth'))
    ),
    map(([_, shoppingListState, authState]) => [
      authState.uid,
      shoppingListState,
    ]),
    filter(([uid, _]) => !!uid), // ignore if not logged in - shopping list can be used as a guest, too
    switchMap(([uid, shoppingListState]: [string, fromShoppingList.State]) => {
      const fragment = uid ?? 'demo';
      return this.httpClient.put(
        `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/shopping-list.json`,
        shoppingListState.ingredients,
        {
          reportProgress: true,
        }
      );
    })
  );

  @Effect()
  recipesFetch = this.actions$.pipe(
    ofType(fromShoppingList.FETCH_INGREDIENTS),
    withLatestFrom(this.appStore.pipe(select('auth'))),
    map(([_, authState]) => [authState.uid]),
    switchMap(([uid]: [string, string]) => {
      const fragment = uid ?? 'demo';
      return this.httpClient.get<Ingredient[]>(
        `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/shopping-list.json`
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
