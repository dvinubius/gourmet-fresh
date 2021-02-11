import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { NoRecipeSelectedComponent } from './no-recipe-selected/no-recipe-selected.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AuthenticationGuard } from '../authentication/authentication-guard.service';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    children: [
      { path: '', component: NoRecipeSelectedComponent, pathMatch: 'full' },
      {
        path: 'new',
        component: RecipeEditComponent,
        canActivate: [AuthenticationGuard],
      },
      // hardcoded paths must be declared first, then come the routes with dynamic parameters
      { path: ':id', component: RecipeDetailComponent },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        canActivate: [AuthenticationGuard],
      }, // will determine in the component whether edit mode or not
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
