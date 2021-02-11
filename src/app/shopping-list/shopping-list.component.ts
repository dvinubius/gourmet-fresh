import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { AppState } from '../store/app.reducers';
import { Store, select } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  shoppingListState: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.shoppingListState = this.store.pipe(select('shoppingList'));
  }

  editIngredient(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEditIngredient(index));
  }
}
