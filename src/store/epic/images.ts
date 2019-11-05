import 'firebase/storage';
import { KnowledgeGraph } from 'models/knowlegdeGraph';
import firebase from 'my-firebase';
import { Epic, ofType } from 'redux-observable';
import { putString } from 'rxfire/storage';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { EpicDependencies } from 'store/configureStore';
import { getType } from 'typesafe-actions';
import urlJoin from 'url-join';
import { selectState } from 'utils/operators';
import { Action, State } from '../reducer';
import { selectImageEntities, selectUid } from '../selectors';
import {
  AddImageAction,
  createAddImage,
  createSetErrorSnackbar,
  createUpdateOneImage,
  createUpdateProgress,
  createUpload,
  SetSnackbarAction,
  UpdateOneImageAction,
  UpdateProgressAction,
} from '../slices';

const upload: Epic<Action, UpdateProgressAction | SetSnackbarAction, State> = (
  action$,
  state$,
) =>
  action$.pipe(
    ofType(getType(createUpload)),
    selectState(selectImageEntities)(state$),
    mergeMap(entities => Object.entries(entities)),
    withLatestFrom(state$.pipe(map(selectUid))),
    mergeMap(([[id, { name, dataUrl }], uid]) =>
      putString(
        firebase.storage().ref(urlJoin('images', uid, id)),
        dataUrl,
        'data_url',
        { customMetadata: { name, id } },
      ),
    ),
    map(({ bytesTransferred, totalBytes, metadata: { customMetadata } }) =>
      createUpdateProgress({
        id: customMetadata!.id,
        uploadStatus:
          bytesTransferred / totalBytes ? 'completed' : 'in progress',
      }),
    ),
    catchError(({ message }) =>
      of(createSetErrorSnackbar({ message, duration: 3000 })),
    ),
  );

const verifyImage: Epic<
  Action,
  UpdateOneImageAction,
  State,
  EpicDependencies
> = (action$, _, { mobilenet$ }) =>
  action$.pipe(
    ofType<Action, AddImageAction>(getType(createAddImage)),
    map(({ payload }) => payload),
    mergeMap(img => {
      const { dataUrl } = img;

      const image = new Image();

      image.src = dataUrl; // eslint-disable-line immutable/no-mutation

      return mobilenet$.pipe(
        switchMap(net => net.classify(image)),
        map(([{ className }]) => className),
        switchMap(className =>
          ajax(
            `https://kgsearch.googleapis.com/v1/entities:search?query=${className.replace(
              / /g,
              '+',
            )}&key=${process.env.REACT_APP_GOOGLE_API_KEY}&limit=1`,
          ),
        ),
        map(({ response }) => response as KnowledgeGraph),
        map(
          ({
            itemListElement: [
              {
                result: { description },
              },
            ],
          }) => description,
        ),
        map(description =>
          createUpdateOneImage({
            ...img,
            verificationStatus:
              description === 'Dog breed' ? 'completed' : 'failed',
          }),
        ),
      );
    }),
  );

export default [upload, verifyImage];
