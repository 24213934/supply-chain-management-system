import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const AuthGuard = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user?.role) {
    return <Navigate to="/" replace />;
  }

  const expectedPath = getRoleBasedPath(user.role);

  if (location.pathname !== expectedPath) {
    return <Navigate to={expectedPath} replace />;
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

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
