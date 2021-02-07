// import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../authentication/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

// can include fromShoppingList.State even though the module is lazily loaded,
// since all the data in the state is of classes known to the whole app.
export interface AppState {
  // shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

export const REDUCERS: ActionReducerMap<AppState> = {
  // shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};
