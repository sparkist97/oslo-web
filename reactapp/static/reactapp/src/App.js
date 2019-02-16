import React, { Component } from "react";
import CheckTextComponent from "./components/CheckTextComponent";
import LoginComponent from "./components/LoginComponent";
import LogoutComponent from "./components/LogoutComponent";
import NavBarComponent from "./components/NavBarComponent";
import { Route, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import "./App.css";
import AddWordComponent from "./components/AddWordComponent";
import RegisterComponent from "./components/RegisterComponent";

class App extends Component {
    constructor(props) {
        super(props);

        var key = localStorage.getItem("key");

        this.state = {
            key: key,
            isLoggedIn: key !== undefined && key != "undefined" && key != null,
            addWordResponse: "",
        };
    }

    render() {
        const routing = (
            <div>
                <NavBarComponent isLoggedIn={this.state.isLoggedIn} />
                <Router>
                    <div className="container">
                        <Route exact path="/" component={CheckTextComponent} />
                        <Route
                            exact
                            path="/login"
                            component={() => (
                                <LoginComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    login={this.login}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/register"
                            component={() => (
                                <RegisterComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    register={this.register}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/logout"
                            component={() => (
                                <LogoutComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    logout={this.logout}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/addword"
                            component={() => (
                                <AddWordComponent
                                    isLoggedIn={this.state.isLoggedIn}
                                    addWord={this.addWord}
                                    addWordResponse={this.state.addWordResponse}
                                />
                            )}
                        />
                    </div>
                </Router>
            </div>
        );
        return routing;
    }

    login = e => {
        e.preventDefault();
        const form = e.target;
        // let url =
        //     "http://" +
        //     window.location.hostname.split(":")[0] +
        //     ":6543/rest-auth/login/"; // ~~should~~ must be changed

        let url = `https://${window.location.hostname}/rest-auth/login/`;
        axios({
            method: "post",
            url: url,
            data: {
                username: form.elements["username"].value,
                password: form.elements["password"].value,
            },
            config: { headers: { "Content-Type": "application/json" } },
        })
            .then(response => {
                //handle success
                localStorage.setItem("key", response.data["key"]);
                this.setState(state => ({ isLoggedIn: true }));
                window.location = "/";
            })
            .catch(function(response) {
                //handle error
                console.log(response);
            });
    };

    register = e => {
        e.preventDefault();
        const form = e.target;
        // let url =
        //     "http://" +
        //     window.location.hostname.split(":")[0] +
        //     ":6543/rest-auth/registration/"; // ~~should~~ must be changed

        let url = `https://${window.location.hostname}/rest-auth/registration/`;
        axios({
            method: "post",
            url: url,
            data: {
                username: form.elements["regusername"].value,
                email: form.elements["email"].value,
                password1: form.elements["password1"].value,
                password2: form.elements["password2"].value,
            },
            config: { headers: { "Content-Type": "application/json" } },
        })
            .then(response => {
                //handle success
                console.log(response);
                localStorage.setItem("key", response.data["key"]);
                this.setState(state => ({
                    isLoggedIn: true,
                    key: response.data["key"],
                }));
                axios.defaults.headers.common["Authorization"] = `Bearer ${
                    this.state.key
                }`;
                window.location = "/";
            })
            .catch(function(response) {
                //handle error
                console.log(response);
            });
    };

    logout = () => {
        // let url =
        //     "http://" +
        //     window.location.hostname.split(":")[0] +
        //     ":6543/rest-auth/logout/"; // ~~should~~ must be changed

        let url = `https://${window.location.hostname}/api/words/`;
        axios({
            method: "post",
            url: url,
            config: { headers: { "Content-Type": "application/json" } },
        })
            .then(response => {
                //handle success
                localStorage.removeItem("key");
                this.setState(state => ({ isLoggedIn: false, key: "" }));
                axios.defaults.headers.common["Authorization"] = "";
                window.location = "/";
            })
            .catch(function(response) {
                //handle error
                console.log(response);
            });
    };

    addWord = e => {
        e.preventDefault();
        const form = e.target;
        this.setState(state => ({ addWordResponse: "working on it" }));
        // let url =
        //     "http://" +
        //     window.location.hostname.split(":")[0] +
        //     ":6543/api/words/"; // ~~should~~ must be changed
        let url = `https://${window.location.hostname}/api/words/`;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${this.state.key}`,
        };
        let data = {
            word: form.elements["word"].value,
            severity: form.elements["severity"].value,
        };
        axios({
            method: "post",
            url: url,
            headers: headers,
            data: data,
        })
            .then(response => {
                //handle success
                this.setState(state => ({
                    addWordResponse: "word was added successfully",
                }));
            })
            .catch(error => {
                //handle error
                this.setState(state => ({
                    addWordResponse: error.response.data["details"],
                }));
            });
    };
}

export default App;
