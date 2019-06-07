import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { checkUser, loadData } from "../Server/fire";

import Loader from "react-loader-spinner";
class App extends Component {
    constructor(props) {
        super(props);
        console.log("in APP constructor");
        this.viewmode = "userdetails";
        this.state = {
            loading: true,
            user: null,
            exists: false
        };
    }

    /**
     * When the App component mounts, we listen for any authentication
     * state changes in Firebase.
     * Once subscribed, the 'user' parameter will either be null
     * (logged out) or an Object (logged in)
     */
    componentDidMount() {
        checkUser(user => {
            if (user) {
                sessionStorage.setItem("authUser", JSON.stringify(user));
            } else {
                sessionStorage.removeItem("authUser");
            }
            this.setState({
                user
            });

            if (user) {
                console.log("Valid User.");

                loadData(e => {
                    this.setState({
                        exists: true,
                        loading: false
                    });
                });
            } else {
                this.setState({
                    loading: false,
                    exists: false
                });
            }
        });
    }

    render() {
        if (this.state.loading === true) {
            return (
                <center>
                    {" "}
                    <Loader type="Rings" height="300" color="darkblue" width="300" />{" "}
                </center>
            );
        } else {
            if (this.state.user) {
                //if user has logged in
                if (this.state.exists) {
                    return <Redirect to="/blogs" />;
                } else {
                    return (
                        <center>
                            <Loader type="Rings" color="darkblue" height="300" width="300" />
                        </center>
                    );
                }
            } else {
                return <Redirect to="/home" />;

            }
        }
    }
}
export default App;
