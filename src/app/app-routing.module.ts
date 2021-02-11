import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { ErrorPageComponent } from './core/error-page/error-page.component';
import { PreloadAllModules } from '@angular/router';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (m) => m.ShoppingListModule
      ),
  },
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
