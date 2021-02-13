import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromAuth from '../../authentication/store/auth.reducer';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-no-recipe-selected',
  template: `
    <h4 *ngIf="(recipes$ | async)?.length > 0">
      Please select a recipe from the list
    </h4>
    <p *ngIf="!(authState | async)?.authenticated">
      Demo content. For the full experience, please log in.
    </p>
  `,
  styles: [
    `
      p {
        opacity: 0.8;
        font-size: 1.1em;
      }
    `,
  ],
})
export class NoRecipeSelectedComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  recipes$ = this.store.pipe(
    select('recipes'),
    map((rState) => rState.recipes)
  );

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.authState = this.store.pipe(select('auth'));
  }
}
