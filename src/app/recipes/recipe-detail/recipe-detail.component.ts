import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRecipes from '../store/recipe.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  disableAdd: boolean;
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
    this.disableAdd = false;
    this.route.params.subscribe((par) => {
      this.id = +par['id'];
      this.recipesState = this.store.select('recipes');
    });
    this.afAuth.currentUser.then((usr) => {
      console.log(usr);
      this.isAuthenticated = !!usr;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.disableAdd = false;
  }

  toShoppingList() {
    if (this.disableAdd) {
      // do nothing, ingredients already added
      return;
    }
    // else - add ingredients via the dispatcher
    this.store
      .pipe(select('recipes'), take(1))
      .subscribe((selectedState: fromRecipes.State) => {
        // this.store.dispatch(
        //     new ShoppingListActions.AddIngredients(
        //       selectedState.recipes[this.id].ingredients
        //     )
        // );
        this.disableAdd = true;
        // confirm
        window.alert('Ingredients (optimistically) added to Shopping List!');
      });
  }

  onDeleteClicked() {
    this.store.dispatch(new fromRecipes.DeleteRecipe(this.id));
    // go away, away, I say
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
