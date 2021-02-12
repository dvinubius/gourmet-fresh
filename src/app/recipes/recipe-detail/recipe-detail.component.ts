import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRecipes from '../store/recipe.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  addedIngredientsToList: boolean;
  recipesState: Observable<fromRecipes.State>;
  id: number; // keep this as source of truth, not including it in the 'recipes' FeatureState
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRecipes.FeatureState>,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.addedIngredientsToList = false;
    this.route.params.subscribe((par) => {
      this.id = +par['id'];
      this.recipesState = this.store.select('recipes');
      this.addedIngredientsToList = false;
    });
    this.afAuth.currentUser.then((usr) => {
      console.log(usr);
      this.isAuthenticated = !!usr;
    });
  }

  toShoppingList() {
    if (this.addedIngredientsToList) {
      // do nothing, ingredients already added
      return;
    }
    // else - add ingredients via the dispatcher
    this.store
      .pipe(select('recipes'), take(1))
      .subscribe((selectedState: fromRecipes.State) => {
        this.store.dispatch(
          new ShoppingListActions.AddIngredients(
            selectedState.recipes[this.id].ingredients
          )
        );
        this.addedIngredientsToList = true;
      });
  }

  onDeleteClicked() {
    this.store.dispatch(new fromRecipes.DeleteRecipe(this.id));
    // go away
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
