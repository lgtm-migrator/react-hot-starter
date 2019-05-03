import { combineReducers } from 'redux';
import { createSelector, defaultMemoize } from 'reselect';
import count from './slices/count';
import theme from './slices/theme';

const reducer = combineReducers({
  count,
  theme,
});

export default reducer;

export type State = ReturnType<typeof reducer>;

export const selectCount = defaultMemoize((state: State) => state.count);

export const selectTheme = defaultMemoize((state: State) => state.theme);

export const selectPaletteType = createSelector(
  selectTheme,
  ({ palette }) => palette.type,
);

export const selectDarkThemeFlag = createSelector(
  selectPaletteType,
  type => type === 'dark',
);
