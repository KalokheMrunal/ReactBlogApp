import React, { Component } from "react";
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

import { registerUser } from "../Server/fire";
import Loader from "react-loader-spinner";
import Header from "../Header/Header2";

export default class Registeration extends Component {
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


  handleRegisterClick = e => {
    e.preventDefault();
    var emailid = ReactDOM.findDOMNode(this.refs.refBusinessEmailId).value;
    var newvalue = ReactDOM.findDOMNode(this.refs.refPassword).value;
    var confirmvalue = ReactDOM.findDOMNode(this.refs.refConfirmPassword).value;
    var userName = ReactDOM.findDOMNode(this.refs.refUserName).value;
    userName = userName.trim();
    newvalue = newvalue.trim();
    confirmvalue = confirmvalue.trim();
    emailid = emailid.trim();
    // If everything is valid, take login action.
    if (
      newvalue === "" ||
      confirmvalue === "" ||
      emailid === "" || userName === ""
    ) {
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

      registerUser(userName, emailid, newvalue, (success, data) => {
        if (success) {
          this.props.history.push("/login");
          baseThis.setState({
            errorCode: null,
            errorMessage: null,
            showProgress: false
          });
        } else {
          if (data.code === "auth/email-already-in-use") {
            alert(
              "Email id " +
              emailid +
              " is already registered. You can directly login using this email id."
            );
            data.code = null;
          }
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
          errMsg = "Please enter all details";
          break;
        case "not-matched":
          errMsg = "Password should match Confirm Password";
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
  gotoLogin = () => {
    this.props.history.push("/login");
  };

  renderRegisterComponent = () => {
    return (
      <form onSubmit={this.handleRegisterClick}>

        <FormGroup
          bsSize="large"
          className="formpad"
          controlId="formValidationError1"
        >
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="text"
              ref="refUserName"
              placeholder="User Name"
              required
            />
          </Row>
        </FormGroup>

        <FormGroup
          bsSize="large"
          className="formpad"
          controlId="formValidationError1"
        >
          <Row>
            <FormControl
              lg="12"
              className="txt_username"
              type="email"
              ref="refBusinessEmailId"
              placeholder="Email Id"
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
              placeholder="Password"
              ref="refPassword"
              minLength="6"
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
            <Button type="submit" className="btn btn-primary col-lg-12">
              REGISTER
            </Button>
          </Row>
        </FormGroup>
        <FormGroup className="formpad">
          <Row>
            <Button
              bsStyle="link"
              className="registerlink col-lg-12"
              onClick={this.gotoLogin}
            >
              Already registered? Login now
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
    } else {
      return (
        <div>
          <Header history={this.props.history} />
          <div className="loginmaincontainer containerHeight">
            <section className="loginComponent">
              <div className="login offset-lg-2 offset-0">
                <Grid>
                  <Row>
                    {/* <Col xs="12" md="12" lg="12"> */}
                    <Col
                      xs={12}
                      sm={12}
                      md={5}
                      lg={3}
                      className="col-cls pr-lg-5 pl-lg-5"
                      horizontal="true"
                    >
                      <FormGroup>
                        {/* <Col > */}
                        <div>
                          <div className="text-left">
                            <div className="registrationtext pt-lg-5 pt-3">
                              REGISTRATION
                            </div>
                          </div>
                          <div className="instructiontext text-left ">
                            Please create an account. A
                            verification link will be sent to your email id.
                          </div>
                        </div>
                      </FormGroup>

                      {this.renderRegisterComponent()}
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
