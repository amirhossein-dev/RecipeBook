import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  console.log('login started');
  const expirationDate = new Date(Date.now() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.authenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate,
    redirect: true,
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'خطایی رخ داده است !';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'این مشخصات قبلا وارد شده است ';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'این آدرس ایمیل وجود ندارد ';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'رمز وارد شده اشتباه می باشد ';
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSinup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((singupAction: AuthActions.SingupStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBozrdBs1CjN-sZK8Qxt28OGh1mInpYGEg',
            {
              email: singupAction.payload.email,
              password: singupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((authRes) => {
              this.authService.setLogoutTimer(+authRes.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBozrdBs1CjN-sZK8Qxt28OGh1mInpYGEg',
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((authRes) => {
              this.authService.setLogoutTimer(+authRes.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    );
  });

  authRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
        tap((authSuccesAction: AuthActions.authenticateSuccess) => {
          if (authSuccesAction.payload.redirect) {
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  authLogout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          this.router.navigate(['/auth']);
          localStorage.removeItem('userData');
        })
      );
    },
    { dispatch: false }
  );

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData')!);
        if (!userData) {
          return { type: 'SHAHAB' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - Date.now();

          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'SHAHAB' };
      })
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
