import { Typography } from '@material-ui/core';
import notFoundImgSrc from 'assets/img/ghost.svg';
import React from 'react';
import Link from './Link';

const NotFound: React.FC = () => (
  <div
    style={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}
  >
    <img style={{ width: '15vw' }} src={notFoundImgSrc} alt="not found" />
    <br />
    <br />
    <Typography variant="h4">Page not found</Typography>
    <br />
    <br />
    <Link to="/">
      <Typography variant="h5">Go back to Dashboard</Typography>
    </Link>
  </div>
);

export default NotFound;
