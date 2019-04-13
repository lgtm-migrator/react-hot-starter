import { combineReducers } from 'redux';
import { createSelector } from 'redux-starter-kit';
import count, { Count } from './count';

export type State = {
  count: Count;
};

export default combineReducers({
  count,
});

export const selectCount = createSelector<State, Count>([
  (state: State) => state.count,
]);
