import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpParams,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { exhaustMap, take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        console.log(user?.token);
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token!),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
