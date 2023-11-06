import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types'; // Import prop-types

const PrivateRoute = ({ component: Component }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Component /> : <Navigate to="/login" replace />;
};
PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
