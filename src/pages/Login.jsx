import React, { Component } from "react";
import "../css/login.css";
import Paper from "@material-ui/core/Paper";
import * as api from "../utlis/apiHelper";
import * as helper from "../utlis/helper";
import { withCookies } from "react-cookie";
import CheckListIcon from "@material-ui/icons/DoneAll";

class Login extends Component {
  state = {
    email: "",
    password: "",
    disableLoginBtn: false,
    showErrorMsg: true,
    errorMsg: null,
    emailInputErr: null,
    showLoader: true
  };
  componentDidMount() {
    helper.isSessionActive().then(response => {
      if (response.active) {
        window.location = "/";
      } else {
        this.setState({ showLoader: false });
      }
    });
  }
  async loginUser() {
    if (this.state.email.includes("@")) {
      this.setState({
        emailInputErr: null,
        errorMsg: null
      });
      let data = {
        username: this.state.email,
        password: this.state.password
      };
      await api.loginUser(data).then(response => {
        if (response !== null) {
          if (response.status === 200 && response.data.code === 0) {
            this.props.cookies.set("auth", response.data.token, {
              path: "/"
            });
            window.location = "/";
          } else {
            this.setState({
              showErrorMsg: true,
              errorMsg: response.data.message
            });
          }
        }
      });
    } else {
      this.setState({
        emailInputErr: "Invalid email address"
      });
    }
  }
  render() {
    const handleKeypress = e => {
      if (
        e.keyCode === 13 &&
        this.state.email !== "" &&
        this.state.password !== "" &&
        !this.state.disableLoginBtn
      ) {
        this.loginUser();
      }
    };
    const handleValueUpdate = event => {
      switch (event.target.id) {
        case "email":
          this.setState({
            email: event.target.value
          });
          break;
        case "password":
          this.setState({
            password: event.target.value
          });

          break;
        default:
          break;
      }
    };
    return (
      <div className="outerLogin">
        {this.state.showLoader ? (
          <div />
        ) : (
          <div className="outerLogin">
            <div>
              <div className="appHeader">
                <h2>
                  <CheckListIcon fontSize="large" className="checklistIcon" />
                  Smart Checklist
                </h2>
              </div>

              <Paper elevation={15} className="innerLogin">
                <h3>Log in</h3>
                <form>
                  <div className="form-group mb-4">
                    <label className="mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={this.state.email}
                      onChange={handleValueUpdate}
                      onKeyDown={handleKeypress}
                    />
                    <div className="errorLabel">{this.state.emailInputErr}</div>
                  </div>

                  <div className="form-group mb-2">
                    <label className="mb-1">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={this.state.password}
                      onChange={handleValueUpdate}
                      onKeyDown={handleKeypress}
                    />
                  </div>
                  {this.state.showErrorMsg && (
                    <div className="errorLabel">{this.state.errorMsg}</div>
                  )}
                  <button
                    disabled={
                      this.state.email === "" ||
                      this.state.password === "" ||
                      this.state.disableLoginBtn
                    }
                    type="button"
                    id="signin"
                    className="btn btn-lg btn-block w-100 mt-4"
                    onClick={e => {
                      this.loginUser();
                    }}
                    onKeyDown={handleKeypress}
                  >
                    Sign In
                  </button>
                  <a
                    id="signup"
                    className="btn btn-lg w-100 mt-1"
                    href="/register"
                  >
                    Sign Up
                  </a>
                </form>
              </Paper>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withCookies(Login);
