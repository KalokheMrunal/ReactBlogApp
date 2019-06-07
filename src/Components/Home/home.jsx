import React, { Component } from "react";
import "./home.css";
import Header from "../../Header/Header1"
import Blog_home from "../../Resources/Assets/Blog_home.jpg";

import {
  Button,
} from "react-bootstrap";

export default class Home extends Component {

  handleRegister = () => {
    const { from } = { from: { pathname: "/registration" } };
    this.props.history.push(from.pathname);
  };

  render() {
    return (
      <div>
        <Header history={this.props.history} />
        <div id="demo" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">

              <img
                src={Blog_home}
                alt="Blog"
                className=" img-ht img-fluid"
                width="100%"
              />

              <div className="carousel-caption caption1">
                <div className="HomeTitleText">Create your blog and <br />
                  share your voice in minutes.
              </div>
              </div>

              <div className="carousel-caption caption2 paddingtop">
                <div className="HomeSubTitleText">Sign up for free to start sharing your ideas.
              </div>

                <div className="carousel-caption caption3 paddingtop">
                  <div>
                    <Button className="savebtn btn_size"
                      onClick={this.handleRegister}
                      autoFocus
                      style={{
                        background: "#0033a0",
                        border: "1px solid #0033a0",
                        borderRadius: "4px"
                      }}
                    >
                      Start Blogging
              </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
