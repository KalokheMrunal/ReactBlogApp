import React, { Component } from "react";
//import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import {
  Grid,
  Button,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
  Row
} from "react-bootstrap";
import Header from "../Header/Header1";
//import image from '../Resources/img.jpg';
// import logo from "../Resources/logo.png";
import "./Login1.css";

import { changePassword, forgotPassword } from "../Server/fire";
import Loader from "react-loader-spinner";
var admin = null;
export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: null,
      errorMessage: null,
      showProgress: true
    };

    this.renderError = this.renderError.bind(this);
  }

  componentDidMount() {
    if (this.props.location.pathname === "/changepassword") {
      var user = JSON.parse(sessionStorage.getItem("authUser"));
      if (!user) {
        console.log("not Valid User.");
        this.props.history.push("/login");
      } else {
        console.log("Valid User.");
        this.setState({
          showProgress: false
        });
      }
    } else {
      this.setState({
        showProgress: false
      });
    }
  }

  handleCPClick = e => {
    e.preventDefault();
    var currentvalue = ReactDOM.findDOMNode(this.refs.refCurrentPassword).value;
    var newvalue = ReactDOM.findDOMNode(this.refs.refNewPassword).value;
    var confirmvalue = ReactDOM.findDOMNode(this.refs.refConfirmPassword).value;
    currentvalue = currentvalue.trim();
    newvalue = newvalue.trim();
    confirmvalue = confirmvalue.trim();
    if (currentvalue === "" || newvalue === "" || confirmvalue === "") {
      this.setState({
        errorCode: "missing",
        errorMessage: null
      });
    } else if (newvalue !== confirmvalue) {
      this.setState({
        errorCode: "not-matched",
        errorMessage: null
      });
    } else {
      this.setState({
        errorCode: null,
        errorMessage: null,
        showProgress: true
      });
      let baseThis = this;

      changePassword(currentvalue, newvalue, (success, data) => {
        if (success) {
          // alert("Your password has been changed!");
          // admin = JSON.parse(sessionStorage.getItem("Admin"));
          // if (!admin) {
          //   this.props.history.push("/");
          // } else {

          this.props.history.push("/blogs");
          // }
          baseThis.setState({
            errorCode: null,
            errorMessage: null,
            showProgress: false
          });
        } else {
          baseThis.setState({
            showProgress: false,
            errorCode: data.code,
            errorMessage: null
          });
        }
      });
    }
  };

  renderError() {
    if (this.state.errorCode !== null) {
      let errMsg = "";

      switch (this.state.errorCode) {
        case "missing":
          errMsg = "Credential missing";
          break;
        case "not-matched":
          errMsg = "New Password should match Confirm Password";
          break;
        case "auth/invalid-email":
          errMsg = "Invalid Email Id";
          break;
        case "auth/user-disabled":
          errMsg = "Your account is disabled. Please contact system admin.";
          break;
        case "auth/password-mismatch":
          errMsg = "New password does not match with re-enterd password.";
          break;
        case "auth/weak-password":
          errMsg = "Password is weak";
          break;
        case "auth/wrong-password":
          errMsg = "Wrong password";
          break;
        case "auth/wrong-cppassword":
          errMsg = "Wrong current password";
          break;
        case "auth/user-not-found":
          errMsg = "User not found";
          break;
        default:
          errMsg = "check Internet connection";
          break;
      }

      return (
        <div id="error_msg" className="error_message">
          {errMsg}
        </div>
      );
    }
  }

  viewFPLayout = () => {
    this.props.history.push("/forgotpassword");
  };

  handleFPClick = e => {
    e.preventDefault();
    var UserNamevalue1 = this.state.fpuserName;
    UserNamevalue1 = UserNamevalue1.trim();
    if (UserNamevalue1 === "") {
      alert("Please enter valid email address");
    } else {
      forgotPassword(UserNamevalue1, success => {
        if (success) {
          alert(
            "A mail has been sent to " +
            UserNamevalue1 +
            " Please check your mail account"
          );
          this.props.history.push("/login");
        } else {
          alert(
            "Couldn't send mail. Please check the email address that you have entered..."
          );
        }
      });
    }
  };

  setEmail = e => {
    this.setState({
      fpuserName: e.target.value
    });
  };
  renderForgotPasswordComponent = () => {
    return (
      <div>
        <FormGroup>
          <div>
            <div className="text-left">
              <div className="registrationtext pt-lg-5 pt-3">
                Forgot Password
              </div>
            </div>
            <div className="instructiontext text-left ">
              Please enter your email id. A verification link will be sent on
              your email. Click on this link to create a new password.
            </div>
          </div>
        </FormGroup>
        <FormGroup bsSize="large" className="formpad">
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="email"
              placeholder="Enter Valid Email Id"
              onChange={this.setEmail}
              value={this.state.fpuserName}
              required
            />
          </Row>
        </FormGroup>
        <FormGroup bsSize="large" className="fphelp formpad">
          <Row>
            <ControlLabel>The link will be sent on this Email Id</ControlLabel>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button
              type="submit"
              onClick={this.handleFPClick}
              className="btn btn-primary col-lg-12"
            >
              SUBMIT
            </Button>
          </Row>
        </FormGroup>
      </div>
    );
  };

  renderChangePasswordComponent = () => {
    return (
      <form onSubmit={this.handleCPClick}>
        <FormGroup>
          <div className="text-left">
            <div className="registrationtext pt-lg-5 pt-3">Change Password</div>
          </div>
        </FormGroup>
        <FormGroup bsSize="large" className="formpad">
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="password"
              ref="refCurrentPassword"
              minLength="6"
              placeholder="Current Password"
              required
            />
          </Row>
        </FormGroup>

        <FormGroup bsSize="large" className="formpad">
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="password"
              placeholder="New Password"
              ref="refNewPassword"
              minLength="6"
              value={this.state.password}
              required
            />
          </Row>
        </FormGroup>
        <FormGroup bsSize="large" className="formpad">
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="password"
              placeholder="Confirm Password"
              ref="refConfirmPassword"
              minLength="6"
              required
            />
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button
              bsStyle="link"
              className="forgotpwdlink col-lg-12"
              onClick={this.viewFPLayout}
            >
              Forgot Password?
            </Button>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button type="submit" className="btn btn-primary col-lg-12">
              SAVE
            </Button>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>{this.renderError()}</Row>
        </FormGroup>
      </form>
    );
  };

  render() {
    if (this.state.showProgress === true) {
      return (
        <center>
          <Loader type="Rings" color="darkblue" height="300" width="300" />
        </center>
      );
    } else
      return (
        <div>
          <Header history={this.props.history} />
          <div className="loginmaincontainer containerHeight">
            <section className="loginComponent" style={{ height: "100%" }}>
              <div className="login offset-lg-2 offset-0">
                <Grid>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={5}
                      lg={3}
                      className="col-cls pr-lg-5 pl-lg-5"
                      horizontal="true"
                    >
                      {this.props.location.pathname === "/changepassword"
                        ? this.renderChangePasswordComponent()
                        : this.renderForgotPasswordComponent()}
                    </Col>
                    <Col xs={12} md={7} lg={5} className="login-img" />
                  </Row>
                </Grid>
              </div>
            </section>
          </div>
        </div>
      );
  }
}
