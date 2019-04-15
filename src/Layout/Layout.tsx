import {
  createStyles,
  Divider,
  Drawer,
  Theme,
  withStyles,
  WithStyles,
  IconButton,
  Hidden,
} from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { ChevronRight } from '@material-ui/icons';
import React, { SFC, useState } from 'react';
import Header from '../Header';
import Nav from '../Nav';

const minWidth = 240;

const margin = 20;

export const LayoutStyle = (theme: Theme) =>
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

export interface LayoutProps extends WithStyles<typeof LayoutStyle> {
  theme: Theme;
}

const Layout: SFC<LayoutProps> = ({
  classes: { toolbar, drawer, drawerPaper, content },
  children,
  theme,
}) => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(previousOpen => !previousOpen);
  };

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <section>
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
            <IconButton onClick={handleDrawerToggle}>
              <ChevronRight />
            </IconButton>
          </Hidden>
        </div>
        <Divider />
        <Nav />
      </Drawer>
      <main className={content}>{children}</main>
    </section>
  );
};

export default withStyles(LayoutStyle, { withTheme: true })(Layout);
