import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAppState from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromAppState.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    console.log('زمان باقی مانده برای لاگین :' + expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
