import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { PreloadingStrategy, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  // {path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
  // {path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
  {
    path: '**',
    component: ErrorPageComponent,
    data: { message: 'Page not found, sorry :-(' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
