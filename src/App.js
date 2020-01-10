import React from "react";
import { BrowserRouter, Route, HashRouter, Redirect } from "react-router-dom";
import DashBoard from "./containers/dashboard";
import Home from "./containers/home";
import ForgotPassword from "./containers/Auth/forgotpassword"
import ResetPassword from "./containers/Auth/resetpassword";
import AdminPanel from "./containers/Admin"
import Terms from "./containers/Auth/Terms"

import "./App.css";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from "react-notifications"


function App() {
  return (
   
      <HashRouter >
        <Route path="/" exact  component={Home} />
        <Route path="/dashboard" component={DashBoard} />
        <Route path="/password_reset" component={ForgotPassword} />
        <Route path="/reset_password/:token" component={ResetPassword} />
        <Route path="/terms" component={Terms} />
        <Route path="/admin" component={AdminPanel} />
        <NotificationContainer />
      </HashRouter>
     
    
  );
}


export default App;
