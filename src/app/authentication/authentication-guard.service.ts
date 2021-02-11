import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AppState } from '../store/app.reducers';
import { Store, select } from '@ngrx/store';
import * as fromAuth from '../authentication/store/auth.reducer';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const ok = this.store.pipe(
      select('auth'),
      take(1),
      map((authState: fromAuth.State) => {
        if (!authState.authenticated) {
          this.router.navigate(['signin'], {
            queryParams: { entryPoint: state.url.split('#')[0] },
            fragment: state.url.split('#')[1],
          });
        }

        return authState.authenticated;
      })
    );

    return ok;
  }
}
