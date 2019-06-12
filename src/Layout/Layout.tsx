import {
  createStyles,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { ChevronLeft } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';
import Nav from './Nav';
import IconButton from '../components/IconButton';

const minWidth = 240;

const margin = 20;

export const layoutStyles = (theme: Theme) =>
  createStyles({
    drawer: {
      minWidth,
    },
    drawerPaper: {
      minWidth,
    },
    toolbar: {
      ...theme.mixins.toolbar,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    content: {
      margin,
      [theme.breakpoints.up('lg')]: {
        marginLeft: margin + minWidth,
      },
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),
    },
  });

export interface LayoutProps extends WithStyles<typeof layoutStyles> {
  theme: Theme;
  isSignedIn: boolean;
}

const Layout: FC<LayoutProps> = ({
  classes: { toolbar, drawer, drawerPaper, content },
  children,
  theme,
  isSignedIn,
}) => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(previousOpen => !previousOpen);
  };

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <section>
      <CssBaseline />
      <Header toggle={handleDrawerToggle} />
      <Drawer
        variant={isLargeScreen ? 'permanent' : 'temporary'}
        open={open}
        onClose={handleDrawerToggle}
        className={drawer}
        classes={{
          paper: drawerPaper,
        }}
      >
        <div className={toolbar}>
          <Hidden lgUp>
            {/* IconButton does not change color when palette type is toggled */}
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeft />
            </IconButton>
          </Hidden>
        </div>
        <Divider />
        <Nav isSignedIn={isSignedIn} onNavigate={handleDrawerToggle} />
      </Drawer>
      <Breadcrumbs className={content} />
      <main className={content}>{children}</main>
    </section>
  );
};

export default withStyles(layoutStyles, { withTheme: true })(Layout);
