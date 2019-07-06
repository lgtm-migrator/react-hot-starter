import { Card, CardActions, CardHeader } from '@material-ui/core';
import Disqus from 'components/Disqus';
import Loader from 'components/Loader';
import { CreateSimpleAction } from 'models/actions';
import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { State } from 'store/reducer';
import {
  CountState,
  createDecrementBy,
  CreateDecrementBy,
  createGetCount,
  createIncrement,
  selectCountLoadingFlag,
  selectCountValue,
} from 'store/slices/count';
import urlJoin from 'url-join';
import Decrement from './Decrement';
import Increment from './Increment';

export interface CountProps extends RouteComponentProps {
  value: CountState['value'];
  isLoading: CountState['isLoading'];
  increment: CreateSimpleAction;
  decrementBy: CreateDecrementBy;
  getCount: CreateSimpleAction;
}

const Count: FC<CountProps> = ({
  match: { path },
  value,
  isLoading,
  increment,
  decrementBy,
  getCount,
}) => {
  useEffect(() => {
    getCount();
  }, [getCount]);

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              Count: <Loader isLoading={isLoading}>{value}</Loader>
            </>
          }
        />
        <CardActions>
          <Switch>
            <Route
              path={urlJoin(path, 'increment')}
              render={() => (
                <Increment isLoading={isLoading} increment={increment} />
              )}
            />
            <Route
              path={urlJoin(path, 'decrement')}
              render={() => (
                <Decrement decrementBy={decrementBy} isLoading={isLoading} />
              )}
            />
          </Switch>
        </CardActions>
      </Card>
      {process.env.NODE_ENV === 'production' && <Disqus />}
    </>
  );
};

export default connect(
  (state: State) => ({
    value: selectCountValue(state),
    isLoading: selectCountLoadingFlag(state),
  }),
  {
    increment: createIncrement,
    decrementBy: createDecrementBy,
    getCount: createGetCount,
  },
)(Count);
