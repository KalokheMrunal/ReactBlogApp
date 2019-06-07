import React, { Component } from "react";
import "./Header1.css";
// import logo from "../Resources/logo.png";
import { Navbar } from "react-bootstrap";
// import rotarylogo from "../Resources/Assets/img_rotary_header_logos.jpg";
// import bitmap from "../Resources/Assets/Bitmap.png";
import logo from "../Resources/blog_logo.png";
export default class componentName extends Component {
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
      </Navbar>
    );
  }
}
