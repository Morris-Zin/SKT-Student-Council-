import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import prop-types

const AdminRoute = ({ component: Component }) => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? <Component /> : <Navigate to="/login" replace />;
};
AdminRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};
export default AdminRoute;
