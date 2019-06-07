import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";

import App from "./App"
import Login from "../Login/Login1";
import Home from "../Components/Home/home";
import ChangePassword from "../Login/ChangePassword";
import Registeration from "../Login/Registeration";
import Blog from "../Components/Blog/Blog";

class App1 extends Component {


  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/login" component={withRouter(Login)} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route exact path="/forgotpassword" component={ChangePassword} />
          <Route exact path="/registration" component={Registeration} />
          <Route exact path="/blogs" component={Blog} />
        </Switch>
      </Router>
    );
  }
}

export default App1;
