import { auth } from 'firebase/app';
import 'firebase/auth';
import { Epic, ofType } from 'redux-observable';
import { authState } from 'rxfire/auth';
import { empty, of, pipe } from 'rxjs';
import { catchError, filter, map, mergeMapTo, switchMap } from 'rxjs/operators';
import { createReset } from '../reducer';
import {
  AuthStateChangeAction,
  authStateChangeType,
  createAuthStateChange,
  createGetAuthState,
  createSetAuthError,
  createSetErrorSnackbar,
  createSetUser,
  createSignin,
  createSignout,
  SetAuthErrorAction,
  setAuthErrorType,
} from '../slices';

const authState$: Epic = action$ =>
  action$.pipe(
    ofType(createGetAuthState.toString()),
    switchMap(() => authState(auth())),
    map(createAuthStateChange),
  );

const mapAuthStateChangeToUser = pipe(
  ofType<AuthStateChangeAction>(authStateChangeType),
  map(({ payload }) => payload),
);

const signIn: Epic = action$ =>
  action$.pipe(
    ofType(createSignin.toString()),
    switchMap(() => {
      const provider = new auth.GoogleAuthProvider();

      return auth().signInWithPopup(provider);
    }),
    mergeMapTo(empty()),
    catchError(({ message }) => of(createSetAuthError(message))),
  );

const userUpdated: Epic = action$ =>
  action$.pipe(
    mapAuthStateChangeToUser,
    filter<any>(Boolean),
    map(createSetUser),
  );

const signedOut: Epic = action$ =>
  action$.pipe(
    mapAuthStateChangeToUser,
    filter(user => !user),
    map(() => createReset()),
  );

const signOut: Epic = action$ =>
  action$.pipe(
    ofType(createSignout.toString()),
    switchMap(() => auth().signOut()),
    mergeMapTo(empty()),
    catchError(({ message }) => of(createSetAuthError(message))),
  );

const authError: Epic = action$ =>
  action$.pipe(
    ofType<SetAuthErrorAction>(setAuthErrorType),
    map(({ payload }) => payload),
    map(message => createSetErrorSnackbar({ message })),
  );

export default [authState$, signIn, userUpdated, signedOut, signOut, authError];
