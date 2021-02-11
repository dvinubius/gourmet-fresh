import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { NoRecipeSelectedComponent } from './no-recipe-selected/no-recipe-selected.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { StoreModule, Store } from '@ngrx/store';
import { recipeReducer } from './store/recipe.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RecipesEffects } from './store/recipe.effects';
import { HttpClientModule } from '@angular/common/http';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipesComponent,
    NoRecipeSelectedComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forFeature('recipes', recipeReducer),
    EffectsModule.forFeature([RecipesEffects]),
  ],
})
export class RecipesModule {}
