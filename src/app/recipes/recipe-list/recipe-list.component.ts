import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRecipes from '../store/recipe.reducer';
import { select, Store } from '@ngrx/store';
import { FeatureState } from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipesState: Observable<fromRecipes.State>;

  constructor(private store: Store<FeatureState>) {}

  ngOnInit() {
    this.recipesState = this.store.pipe(select('recipes'));
  }
}
