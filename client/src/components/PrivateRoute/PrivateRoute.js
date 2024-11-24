import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, isAuthenticated, ...rest }) => {
  // return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
  return <Element {...rest} />;
};

export default PrivateRoute;
