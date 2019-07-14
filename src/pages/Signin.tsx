import { Typography, useTheme } from '@material-ui/core';
import google from 'assets/img/google.svg';
import { Button } from 'components';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { selectAuthLoadingFlag, State } from 'store';
import { createSignin, CreateSignin } from 'store/slices';

export interface SigninProps {
  signIn: CreateSignin;
  isAuthLoading: ReturnType<typeof selectAuthLoadingFlag>;
}

const Signin: FC<SigninProps> = ({ signIn, isAuthLoading }) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h2">Welcome</Typography>
      <br />
      <Typography>You can sign in using your Google account</Typography>
      <br />
      <Button
        variant="contained"
        onClick={() => signIn()}
        isLoading={isAuthLoading}
      >
        <img
          height={theme.typography.fontSize + 5}
          src={google}
          alt="Google Logo"
        />
        <span style={{ marginLeft: 5 }}>Sign in</span>
      </Button>
    </>
  );
};

export default connect(
  (state: State) => ({
    isAuthLoading: selectAuthLoadingFlag(state),
  }),
  { signIn: createSignin },
)(Signin);
