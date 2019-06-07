import React, { Component } from "react";
import "./Header1.css";
import logo from "../Resources/blog_logo.png";
// import logo from "../Resources/logo.png";
// import rotarylogo from "../Resources/Assets/img_rotary_header_logos.jpg";

import { logout } from "../Server/fire";
import { Navbar, Nav, NavItem } from "react-bootstrap";
// import bitmap from "../Resources/Assets/Bitmap.png";

export default class Header1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headermode: true, //login if true

    };
  }

  componentDidMount() {
    var user = JSON.parse(sessionStorage.getItem("authUser"));

    if (user)
      this.setState({
        headermode: false,

      });
    else
      this.setState({
        headermode: true,
      });
  }

  handleLogin = () => {
    const { from } = { from: { pathname: "/login" } };
    this.props.history.push(from.pathname);
  };

  handleRegister = () => {
    const { from } = { from: { pathname: "/registration" } };
    this.props.history.push(from.pathname);
  };

  handleClickFAQ = () => {
    const { from } = { from: { pathname: "/FAQ" } };
    this.props.history.push(from.pathname);
  };

  handleLogout = () => {
    if (window.confirm("Are you sure you want Logout")) {
      logout(e => {
        this.setState(
          {
            headermode: true,
          },
          () => {
            const { from } = { from: { pathname: "/home" } };
            this.props.history.push(from.pathname);
          }
        );
      });
    }
  };

  handleChangePassword = () => {
    const { from } = { from: { pathname: "/changepassword" } };
    this.props.history.push(from.pathname);
  };

  render() {
    return (
      <Navbar
        collapseOnSelect
        className="pl-0 pl-lg-5 mb-0 mb-lg-2 mb-md-2 backgroungcolor"
      >
        <Navbar.Header>
          <Navbar.Brand className="pl-0">
            <div>
              <img src={logo} alt="logo" className="img-fluid img-ht1" />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.state.headermode ? (
            <Nav pullRight className="menutext ml-auto">
              <NavItem className="navitemtext" onSelect={this.handleRegister}>
                Register
              </NavItem>
              <NavItem className="navitemtext" onSelect={this.handleLogin}>
                Login
              </NavItem>{" "}
            </Nav>
          ) : (

              <Nav pullRight className="menutext ml-auto">
                <NavItem
                  className="navitemtext"
                  onSelect={this.handleChangePassword}
                >
                  Change Password
              </NavItem>
                <NavItem className="navitemtext" onSelect={this.handleLogout}>
                  Logout
              </NavItem>
              </Nav>
            )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
