import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import UserDashboard from "./pages/client/userDashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import LoadingSpinner from "./components/custom/LoadingSpinner";

const PrivateRoute = ({
  component: Component,
  adminOnly,
  anyLoggedIn,
  ...rest
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.user.role === "admin");
        }
      } catch (error) {
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
    return <Redirect to="/login" />;
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
