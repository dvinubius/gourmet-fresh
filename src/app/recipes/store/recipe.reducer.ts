import { Action } from '@ngrx/store';
import { Recipe } from '../../shared/recipe.model';
import { Ingredient } from '../../shared/ingredient.model';
import { AppState } from '../../store/app.reducers';

export type RecipeActions =
  | SetRecipes
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | FetchRecipes;

export interface FeatureState extends AppState {
  recipes: State;
}

export interface State {
  recipes: Recipe[];
  editedRecipe: null;
}

// for the reducer
const initialState: State = {
  recipes: [],
  editedRecipe: null,
};

export function recipeReducer(state = initialState, action: RecipeActions) {
  switch (action.type) {
    case SET_RECIPES: {
      return {
        ...state,
        recipes: [...action.payload],
      };
    }
    case ADD_RECIPE: {
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    }
    case UPDATE_RECIPE: {
      const newRecipesArray = [...state.recipes];
      const recipeClone = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe,
      };
      newRecipesArray[action.payload.index] = recipeClone;
      return {
        ...state,
        recipes: newRecipesArray,
      };
    }
    case DELETE_RECIPE: {
      const newRecipesArray = [...state.recipes];
      newRecipesArray.splice(action.payload, 1);
      return {
        ...state,
        recipes: newRecipesArray,
      };
    }
    default: {
      return state;
    }
  }
}

export const SET_RECIPES = 'SET_RECIPES';
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE = 'UPDATE_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const FETCH_RECIPES = 'FETCH_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}
export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;
  constructor(public payload: Recipe) {}
}
export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;
  constructor(public payload: { index: number; recipe: Recipe }) {}
}
export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;
  constructor(public payload: number) {}
}
export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}
