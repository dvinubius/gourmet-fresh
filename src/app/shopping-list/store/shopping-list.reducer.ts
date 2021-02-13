import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import { AppState } from '../../store/app.reducers';

export interface FeatureState extends AppState {
  ingredients: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

// for reducer
const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

/* ========== REDUCER ========= */
export function shoppingListReducer(
  state = initialState,
  action: ShoppingListAction
): State {
  switch (action.type) {
    case SET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
      };
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case UPDATE_INGREDIENT:
      const currentIngredient = state.ingredients[state.editedIngredientIndex]; // the ingredient to be updated
      const newIngredient = {
        ...currentIngredient, // takes values from all attributes of currentIngredient
        ...action.payload, // overwrites attributes of currentIngredient with new values
      };
      const newIngredients = [...state.ingredients]; // makes copy of current ingredients in the state
      newIngredients[state.editedIngredientIndex] = newIngredient; // makes the update on the target element
      return {
        ...state,
        ingredients: newIngredients,
        editedIngredient: null, // finished editing, reset
        editedIngredientIndex: -1, // finished editing, reset
      };
    case DELETE_INGREDIENT:
      const copy = [...state.ingredients];
      copy.splice(state.editedIngredientIndex, 1);
      return {
        ...state,
        ingredients: copy,
        editedIngredient: null, // finished editing, reset
        editedIngredientIndex: -1, // finished editing, reset
      };
    case START_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };
    case STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    default: {
      return state;
    }
  }
}

/* ACTIONS ON SHOPPING-LIST */

// ACTION TYPES
export const SET_INGREDIENTS = 'SET_INGREDIENTS';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT_INGREDIENT = 'START_EDIT_INGREDIENT';
export const STOP_EDIT_INGREDIENT = 'STOP_EDIT_INGREDIENT';
export const FETCH_INGREDIENTS = 'FETCH_INGREDIENTS';

export class SetIngredients implements Action {
  readonly type = SET_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;

  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;

  constructor() {}
}

export class StartEditIngredient implements Action {
  readonly type = START_EDIT_INGREDIENT;

  constructor(public payload: number) {}
}

export class StopEditIngredient implements Action {
  readonly type = STOP_EDIT_INGREDIENT;
}

export class FetchIngredients implements Action {
  readonly type = FETCH_INGREDIENTS;
}

// ALL ACTIONS ON SHOPPING-LIST, bundled as one TS type
type ShoppingListAction =
  | SetIngredients
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEditIngredient
  | StopEditIngredient
  | FetchIngredients;
