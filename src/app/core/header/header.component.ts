import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';
import * as fromAuth from '../../authentication/store/auth.reducer';
import { Observable } from 'rxjs/Observable';
import * as fromRecipes from '../../recipes/store/recipe.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.authState = this.store.pipe(select('auth'));
  }

  onLogout() {
    this.store.dispatch(new fromAuth.Signout());
  }

  getAuthState() {
    return this.store.pipe(select('auth'));
  }
}
