import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role) {
    const roleBasedPath = getRoleBasedPath(user.role);
    return <Navigate to={roleBasedPath} replace />;
  }

  return children;
};

const getRoleBasedPath = (role) => {
  switch (role.toUpperCase()) {
    case "BUYER":
      return "/buyer";
    case "SUPPLIER":
      return "/supplier";
    case "MANAGER":
      return "/manager";
    default:
      return "/";
  }
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
