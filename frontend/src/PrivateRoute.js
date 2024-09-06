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
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/profile`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.user?.role === "admin");
        } else {
          setError("Unexpected response status");
        }
      } catch (error) {
        console.error(
          "Error fetching user profile:",
          error.response?.data || error.message
        );
        setError("Failed to fetch user profile");
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

  if (error) {
    return <div>Error: {error}</div>; // or redirect to an error page
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
