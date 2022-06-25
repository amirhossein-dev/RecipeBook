import { User } from '../user.model';

import * as AuthActions from './auth.actions';
export interface State {
  user: User | null;
  AuthError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  AuthError: null,
  loading: false,
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActoions
): State {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        AuthError: null,
        user: user,
        loading: false,
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        AuthError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        AuthError: action.payload,
        loading: false,
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        AuthError: null,
      };
    default:
      return state;
  }
}
