// PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import UserDashboard from "./components/client/userDashboard";
import AdminDashboard from "./components/admin/Dashboard";

const PrivateRoute = ({ component: Component, ...rest }) => {
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
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          isAdmin ? (
            <AdminDashboard>
              <Component {...props} />
            </AdminDashboard>
          ) : (
            <UserDashboard>
              <Component {...props} />
            </UserDashboard>
          )
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
