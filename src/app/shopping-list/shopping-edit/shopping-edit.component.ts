import { Component, OnInit, ViewChild } from '@angular/core';
import * as ShoppingListActions from '../store/shopping-list.reducer';
import { Ingredient } from '../../shared/ingredient.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('submitButton') submitButton;
  editedIngredient: Ingredient;
  ingredientForm: FormGroup;
  subscription: Subscription;
  triedSubmit = false;

  editMode: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.ingredientForm = new FormGroup({
      ingredientName: new FormControl(null, Validators.required),
      amount: new FormControl(null, [
        Validators.required,
        this.forbiddenAmounts,
      ]),
    });
    this.subscription = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = state.editedIngredient;
        this.ingredientForm.setValue({
          ingredientName: this.editedIngredient.name,
          amount: this.editedIngredient.amount,
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  onSubmit() {
    this.triedSubmit = true;
    if (!this.ingredientForm.valid) {
      return;
    }

    const ing = this.ingredientForm.value;
    const newIngredient = new Ingredient(ing.ingredientName, ing.amount);

    if (!this.editMode) {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    } else {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    }
    this.onClear();
  }

  forbiddenAmounts(control: FormControl): { [errorCode: string]: boolean } {
    if (control.value <= 0) {
      return { forbiddenAmounts: true };
    }
    // else
    return null;
  }

  onDelete() {
    if (!this.editMode) {
      return;
    } else {
      this.store.dispatch(new ShoppingListActions.DeleteIngredient());
      this.onClear();
    }
  }

  onClear() {
    this.editMode = false;
    this.ingredientForm.reset();
    this.triedSubmit = false;
  }
}
