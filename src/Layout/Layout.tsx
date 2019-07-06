import {
  createStyles,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  useMediaQuery,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { IconButton } from 'components';
import { EnhancedTheme } from 'models';
import React, { FC, useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Header from './Header';
import Nav from './Nav';

const minWidth = 240;

const margin = 20;

export const layoutStyles = (theme: EnhancedTheme) => {
  const lg = theme.breakpoints.up('lg');

  return createStyles({
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
      [lg]: {
        marginLeft: margin + minWidth,
      },
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),
    },
    header: {
      [lg]: {
        marginLeft: minWidth,
      },
    },
  });
};
export interface LayoutProps extends WithStyles<typeof layoutStyles> {
  theme: EnhancedTheme;
  isSignedIn: boolean;
}

const Layout: FC<LayoutProps> = ({
  classes: { toolbar, drawer, drawerPaper, content, header },
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
      <Header toggle={handleDrawerToggle} className={header} />
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
      {isSignedIn && <Breadcrumbs className={content} />}
      <main className={content}>{children}</main>
    </section>
  );
};

export default withStyles(layoutStyles, { withTheme: true })(Layout);
