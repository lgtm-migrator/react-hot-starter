import { colors, createMuiTheme } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import { Snackbar } from 'components';
import Layout from 'Layout';
import { WithColors } from 'models';
import { CreateSimpleAction } from 'models/actions';
import React, { FC, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { selectSignedInFlag, selectTheme, State } from 'store';
import { createGetAuthState } from 'store/slices';
import Routes from './Routes';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme extends WithColors {}
}

export interface AppProps {
  isSignedIn: ReturnType<typeof selectSignedInFlag>;
  themeOptions: ThemeOptions;
  getAuthState: CreateSimpleAction;
}

const App: FC<AppProps> = ({ getAuthState, isSignedIn, themeOptions }) => {
  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const theme = createMuiTheme({
    ...themeOptions,
    colors: { success: colors.green[600] },
  } as ThemeOptions);

  return (
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <Layout isSignedIn={isSignedIn}>
          <Routes isSignedIn={isSignedIn} />
        </Layout>
      </MuiThemeProvider>
      <Snackbar />
    </ThemeProvider>
  );
};

export default hot(module)(
  connect(
    (state: State) => ({
      themeOptions: selectTheme(state),
      isSignedIn: selectSignedInFlag(state),
    }),
    {
      getAuthState: createGetAuthState,
    },
  )(App),
);
