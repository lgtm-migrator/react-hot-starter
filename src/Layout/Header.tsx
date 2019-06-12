import {
  AppBar,
  createStyles,
  Hidden,
  Toolbar,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { Menu, WbSunny, WbSunnyOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { CreateSimpleAction } from '../models/actions';
import {
  selectDarkThemeFlag,
  State,
  selectSignedInFlag,
  selectAuthLoadingFlag,
} from '../store/reducer';
import { createToggleType } from '../store/slices/theme/palette/type';
import Button from '../components/Button';
import { createSignout } from '../store/slices/auth';
import IconButton from '../components/IconButton';

const headerStyles = createStyles({
  header: {
    flexGrow: 1,
  },
  expand: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

export interface HeaderProps extends WithStyles<typeof headerStyles> {
  toggle: () => void;
  isDark: boolean;
  togglePaletteType: CreateSimpleAction;
  isSignedIn: boolean;
  signOut: CreateSimpleAction;
  authLoading: boolean;
}

const Header: FC<HeaderProps> = ({
  classes: { header, expand, menuButton },
  toggle,
  isDark,
  togglePaletteType,
  isSignedIn,
  signOut,
  authLoading,
}) => (
  <AppBar position="static" className={header}>
    <Toolbar>
      <Hidden lgUp>
        <IconButton className={menuButton} aria-label="Menu" onClick={toggle}>
          <Menu />
        </IconButton>
      </Hidden>
      <Typography className={expand} variant="h6" color="inherit">
        App Name
      </Typography>
      {(isSignedIn || authLoading) && (
        <Button onClick={signOut} loading={authLoading}>
          Log out
        </Button>
      )}
      <IconButton onClick={() => togglePaletteType()}>
        {isDark ? <WbSunny /> : <WbSunnyOutlined />}
      </IconButton>
    </Toolbar>
  </AppBar>
);

const mapStateToProps = (state: State) => ({
  isDark: selectDarkThemeFlag(state),
  isSignedIn: selectSignedInFlag(state),
  authLoading: selectAuthLoadingFlag(state),
});

const mapDispatchToProps = {
  togglePaletteType: createToggleType,
  signOut: createSignout,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(headerStyles)(Header));
