import React, { Component } from "react";
//import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import {
  Grid,
  Button,
  FormGroup,
  Col,
  FormControl,
  Row
} from "react-bootstrap";

import "./Login1.css";
import Header from "../Header/Header2";
import { login, emailVerificationLink, server } from "../Server/fire";
import Loader from "react-loader-spinner";
var adminRef = null;
export default class Login1 extends Component {
  constructor(props) {
    super(props);


    this.state = {
      isValidUsername: null,
      isValidPassword: null,
      errorCode: null,
      errorMessage: null,
      showProgress: true,
      userName: null,
      password: null,
      fpuserName: "",
      changePassword: false,
      registerlink: false
    };
    this.renderError = this.renderError.bind(this);
  }

  componentDidMount() {
    var user = JSON.parse(sessionStorage.getItem("authUser"));

    if (user) {
      //already logged in
      console.log("Valid User.");
      this.props.history.push("/");
    } else {
      console.log("not Valid User.");
      this.setState({
        showProgress: false
      });
    }
  }

  handleLoginClick = e => {
    e.preventDefault();

    var UserNamevalue = ReactDOM.findDOMNode(this.refs.refUserName).value;
    var Passwordvalue = ReactDOM.findDOMNode(this.refs.refPassword).value;
    UserNamevalue = UserNamevalue.trim();
    Passwordvalue = Passwordvalue.trim();

    var isValidUsername = null;
    if (UserNamevalue === "") {
      isValidUsername = "error";
    }

    var isValidPassword = null;
    if (Passwordvalue === "") {
      isValidPassword = "error";
    }

    if (isValidUsername != null || isValidPassword != null) {
      this.setState(
        {
          errorCode: "missing",
          errorMessage: null,
          isValidUsername: isValidUsername,
          isValidPassword: isValidPassword
        },
        () => {
          this.renderError(UserNamevalue);
        }
      );
    } else {
      this.setState({
        errorCode: null,
        errorMessage: null,
        isValidUsername: null,
        isValidPassword: null,
        showProgress: true
      });
      let baseThis = this;
      login(UserNamevalue, Passwordvalue, (success, data) => {
        if (success) {
          var user = JSON.parse(sessionStorage.getItem("authUser"));

          var that = this;

          this.props.history.push("/blogs");
          baseThis.setState({
            errorCode: null,
            errorMessage: null,
            showProgress: false,
            userName: UserNamevalue,
            password: Passwordvalue
          });
        } else {
          var link;
          if (data.code === "email-not-verified") link = true;
          else link = false;
          baseThis.setState(
            {
              showProgress: false,
              errorCode: data.code,
              errorMessage: null,
              registerlink: link
            },
            () => {
              this.renderError(UserNamevalue);
            }
          );
        }
      });
    }
  };

  renderError(emailid) {
    if (this.state.errorCode !== null) {
      let errMsg = "";
      switch (this.state.errorCode) {
        case "missing":
          errMsg =
            "Please enter a valid email address and password to proceed.";
          break;
        case "auth/invalid-email":
          errMsg = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errMsg = "Your account is disabled. Please call us at +918007630379.";
          break;
        case "auth/password-mismatch":
          errMsg =
            "New password does not match with re-entered password. Please try again.";
          break;
        case "auth/wrong-password":
          errMsg =
            "The user id and password you entered did not match. Please try again.";
          break;
        case "auth/user-not-found":
          errMsg =
            "This email address is not registered. Please verify that you have entered it correct. Please go to Register page to register a new address.";
          break;
        case "email-not-verified":
          errMsg =
            "Your email address " +
            emailid +
            " needs to be verified. An email has just been sent to you. Please click on the link provided in the email to verify email address. ";
          break;
        default:
          errMsg =
            "There was a problem communicating with the server. Please try again later."; // msg change
          break;
      }

      return (
        alert(errMsg)
      );
    }
  }

  viewFPLayout = () => {
    this.props.history.push("/forgotpassword");
  };

  clearRegisterLink = () => {
    emailVerificationLink();
    this.setState({
      registerlink: false,
      errorCode: null
    });
  };

  gotoRegister = () => {
    this.props.history.push("/registration");
  };

  renderLoginComponent = () => {
    return (
      <form onSubmit={this.handleLoginClick}>
        <FormGroup
          bsSize="large"
          className="formpad"
          controlId="formValidationError1"
          validationState={this.state.isValidUsername}
        >
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="email"
              ref="refUserName"
              placeholder="Email-id"
              required
            />
          </Row>
        </FormGroup>

        <FormGroup
          bsSize="large"
          controlId="formValidationError2"
          className="formpad"
          validationState={this.state.isValidPassword}
        >
          <Row>
            <FormControl
              lg="12"
              className="txt_username formpad"
              type="password"
              placeholder="Password"
              ref="refPassword"
              value={this.state.password}
              required
            />
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Col>
              <Button
                bsStyle="link"
                className="registerlink col-lg-12"
                onClick={this.viewFPLayout}
              >
                Forgot Password?
              </Button>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button type="submit" className="btn btn-primary col-lg-12">
              SIGN IN
            </Button>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button
              bsStyle="link"
              className="registerlink col-lg-12"
              onClick={this.gotoRegister}
            >
              New user? Register now
            </Button>
          </Row>
        </FormGroup>
        {this.state.registerlink ? (
          <FormGroup className="formpad">
            <Row>
              <Button
                bsStyle="link"
                className="registerlink col-lg-12"
                onClick={this.clearRegisterLink}
              >
                Resend Email Verification link
              </Button>
            </Row>
          </FormGroup>
        ) : null}
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
    } else {
      return (
        <div>
          <Header history={this.props.history} />
          <div className="loginmaincontainer containerHeight">
            <section className="loginComponent">
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
                      <FormGroup>
                        <div>
                          <div className="text-left">
                            <div className="registrationtext pt-lg-5 pt-3">
                              LOGIN
                            </div>
                          </div>
                          <div className="instructiontext text-left ">
                            Please sign in to access your account.
                          </div>
                        </div>
                      </FormGroup>
                      {this.renderLoginComponent()}
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
}
