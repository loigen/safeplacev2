import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import PrivateRoute from "./PrivateRoute";
import Profile from "./components/admin/Profile";
import Home from "./pages/admin/Home";
import Patients from "./pages/admin/Patients";
import MrJebBlog from "./pages/client/MrJebBlog";
import AppointmentsPage from "./pages/client/AppointmentsPage";
import PatientDetail from "./components/custom/PatientDetail";
import AdminSettings from "./pages/admin/Settings";
import ClientSettings from "./pages/client/Settings";
import BLog from "./pages/admin/BLog";
import Schedules from "./pages/admin/Schedules";
import {
  BlogGuestPage,
  Contact,
  NotFound,
  LandingPage,
  About,
  Signup,
  Login,
} from "./components";
import Reset from "./components/custom/Reset";
import ContactSupport from "./components/custom/ContactSupport";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={LandingPage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/guestBlog" component={BlogGuestPage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/patients/:id" element={PatientDetail} />
        <Route path="/forgot-password" component={Reset} />

        {/* Private Routes for All Authenticated Users */}
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/MR_JEB_BLOG" component={MrJebBlog} />
        <PrivateRoute path="/Booking" component={AppointmentsPage} />
        <PrivateRoute path="/clientSettings" component={ClientSettings} />
        <PrivateRoute path="/contactSupport" component={ContactSupport} />

        {/* Admin-Only Private Routes */}
        <PrivateRoute path="/home" component={Home} adminOnly />
        <PrivateRoute path="/patients" component={Patients} adminOnly />
        <PrivateRoute path="/schedule" component={Schedules} adminOnly />
        <PrivateRoute path="/blog" component={BLog} adminOnly />
        <PrivateRoute
          path="/AdminSettings"
          component={AdminSettings}
          adminOnly
        />

        {/* Catch-All Route for 404 */}
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
