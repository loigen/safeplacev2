import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import UserDashboard from "./pages/client/userDashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import LoadingSpinner from "./components/custom/LoadingSpinner";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({
  component: Component,
  adminOnly,
  anyLoggedIn,
  ...rest
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (user && user.role) {
          setIsAuthenticated(true);
          setIsAdmin(user.role === "admin");
        } else {
          console.error("User data or role is missing in the response");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  if (adminOnly && !isAdmin) {
    return <Redirect to="/forbidden" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        adminOnly ? (
          <AdminDashboard>
            <Component {...props} />
          </AdminDashboard>
        ) : anyLoggedIn ? (
          <UserDashboard>
            <Component {...props} />
          </UserDashboard>
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
