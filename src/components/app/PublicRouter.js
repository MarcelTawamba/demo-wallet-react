import React from 'react';
import AuthContainer from 'screens/auth';
import { Route } from 'react-router-dom';

const PublicRouter = props => {
  return (
    <Route
      render={routeProps => <AuthContainer {...routeProps} {...props} />}
      path="/"
    />
  );
};
export default PublicRouter;
