import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage.component";
import About from "./components/About.component";
import Contact from "./components/contact.component";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute";
import Profile from "./components/admin/Profile";
import Home from "./components/admin/Home";
import Patients from "./components/admin/Patients";
import Schedules from "./components/admin/Schedules";
import BLog from "./components/admin/BLog";
import MrJebBlog from "./components/client/MrJebBlog";
import AppointmentsPage from "./components/client/AppointmentsPage";
import PatientDetail from "./components/custom/PatientDetail";
import AdminSettings from "./components/admin/Settings";
import ClientSettings from "./components/client/Settings";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={LandingPage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/patients/:id" element={PatientDetail} />

        {/* Private Routes for All Authenticated Users */}
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/MR_JEB_BLOG" component={MrJebBlog} />
        <PrivateRoute path="/Booking" component={AppointmentsPage} />
        <PrivateRoute path="/clientSettings" component={ClientSettings} />

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
