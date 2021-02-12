import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment.prod';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

import { StoreModule, Store } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { REDUCERS, AppState } from './store/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './authentication/store/auth.effects';
import { AuthenticationModule } from './authentication/authentication.module';

import * as fromRecipes from './recipes/store/recipe.reducer';
import * as fromShoppingList from './shopping-list/store/shopping-list.reducer';
import { RecipesEffects } from './recipes/store/recipe.effects';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthenticationModule,
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    StoreModule.forRoot(REDUCERS),
    EffectsModule.forRoot([AuthEffects, RecipesEffects, ShoppingListEffects]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private store: Store<AppState>) {
    this.store.dispatch(new fromRecipes.FetchRecipes());
    this.store.dispatch(new fromShoppingList.FetchIngredients());
  }
}
