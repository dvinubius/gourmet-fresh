import { Action } from '@ngrx/store';


export interface State {
  token: string;
  authenticated: boolean;
  user: string;
}


const initialState = {
  token: null,
  authenticated: false,
  user: null
};


/* ========== REDUCER ========= */
export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SIGN_UP :
    case SIGN_IN : {
      return {
        ...state,
        authenticated: true
      };
    }
    case SIGN_OUT : {
      return {
        ...state,
        token: null,
        authenticated: false,
        user: null
      };
    }
    case SET_TOKEN : {
      return {
        ...state,
        token: action.payload
      };
    }
    case SET_USER : {
      return {
        ...state,
        user: action.payload
      };
    }
    default :
      return state;
  }
}


/* ACTIONS ON SHOPPING-LIST */

// ACTION TYPES
export const ATTEMPT_SIGN_UP = 'ATTEMPT_SIGN_UP';
export const ATTEMPT_SIGN_IN = 'ATTEMPT_SIGN_IN';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';


// Bundle all actions into one type
type AuthActions = Signin | Signout | Signup | SetToken | AttemptSignup | AttemptSignin | SetUser;

export class AttemptSignup implements Action {
  readonly type = ATTEMPT_SIGN_UP;
  constructor(public payload: {username: string, password: string}) {}
}

export class AttemptSignin implements Action {
  readonly type = ATTEMPT_SIGN_IN;
  constructor(public payload: {username: string, password: string, location: string}) {}
}

export class Signin implements Action {
  readonly type = SIGN_IN;
}
export class Signup implements Action {
  readonly type = SIGN_UP;
}
export class Signout implements Action {
  readonly type = SIGN_OUT;
}
export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {}
}
export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: string) {}
}

