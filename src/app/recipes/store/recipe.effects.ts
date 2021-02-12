import { Injectable } from '@angular/core';
import * as fromRecipes from '../store/recipe.reducer';
import { Effect, ofType } from '@ngrx/effects';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { Recipe } from '../../shared/recipe.model';
import { FeatureState } from '../store/recipe.reducer';
import { Store, select } from '@ngrx/store';

import { withLatestFrom, switchMap, map, mergeMap } from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<FeatureState>,
    private appStore: Store<AppState>
  ) {}

  @Effect({ dispatch: false })
  recipesStore = this.actions$.pipe(
    ofType(
      fromRecipes.ADD_RECIPE,
      fromRecipes.DELETE_RECIPE,
      fromRecipes.UPDATE_RECIPE
    ),
    withLatestFrom(
      this.store.pipe(select('recipes')),
      this.appStore.pipe(select('auth'))
    ),
    map(([_, recipesState, authState]) => [authState.uid, recipesState]),
    switchMap(([uid, state]: [string, fromRecipes.State]) => {
      const fragment = uid ?? 'demo';
      return this.httpClient.put(
        `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/recipes.json`,
        state.recipes,
        {
          reportProgress: true,
        }
      );
    })
  );

  @Effect()
  recipesFetch = this.actions$.pipe(
    ofType(fromRecipes.FETCH_RECIPES),
    withLatestFrom(this.appStore.pipe(select('auth'))),
    map(([_, authState]) => [authState.uid]),
    switchMap(([uid]: [string]) => {
      const fragment = uid ?? 'demo';
      return this.httpClient.get<Recipe[]>(
        `https://gourmet-8fcd2-default-rtdb.europe-west1.firebasedatabase.app/${fragment}/recipes.json`
      );
    }),
    map((recipes) => {
      recipes = recipes ?? [];
      recipes.forEach((r) => (r['ingredients'] = r['ingredients'] ?? []));
      return {
        type: fromRecipes.SET_RECIPES,
        payload: recipes,
      };
    })
  );
}
