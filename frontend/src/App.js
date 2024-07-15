// App.js
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage.component";
import About from "./components/About.component";
import Contact from "./components/contact.component";
import NotFound from "./components/NotFound";
import PrivateRoute from "./PrivateRoute";
import Profile from "./components/custom/Profile";
import Home from "./components/admin/Home";
import Patients from "./components/admin/Patients";
import Schedules from "./components/admin/Schedules";
import BLog from "./components/admin/BLog";
import Settings from "./components/admin/Settings";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/patients" component={Patients} />
        <PrivateRoute path="/schedule" component={Schedules} />
        <PrivateRoute path="/blog" component={BLog} />
        <PrivateRoute path="/settings" component={Settings} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
