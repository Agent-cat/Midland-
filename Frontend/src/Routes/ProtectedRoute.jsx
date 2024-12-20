import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, loggedIn, authRoute = false }) => {
  if (authRoute && loggedIn) {
    return <Navigate to="/" />;
  }

  if (!authRoute && !loggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
