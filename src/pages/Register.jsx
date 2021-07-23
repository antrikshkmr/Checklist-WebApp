import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "../css/register.css";
import * as api from "../utlis/apiHelper";
import { withCookies } from "react-cookie";
class Register extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    showErrorMsg: true,
    errorMsg: null,
    firstNameInputErr: null,
    lastNameInputErr: null,
    emailInputErr: null,
    passwordInputErr: null,
    confirmPasswordInputErr: null,
    disableRegisterBtn: false
  };

  async registerUser() {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.state.email
      )
    ) {
      this.setState({
        emailInputErr: null
      });
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.email,
        password: this.state.password
      };
      await api.registerUser(data).then(response => {
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
        emailInputErr: "Invalid Email"
      });
    }
  }
  render() {
    const handleValueUpdate = event => {
      switch (event.target.id) {
        case "firstName":
          if (event.target.value.length > 40) {
            this.setState({
              firstNameInputErr: "First name should not be more 40 characters"
            });
          } else {
            this.setState({
              firstNameInputErr: null,
              firstName: event.target.value
            });
          }

          break;
        case "lastName":
          if (event.target.value.length > 40) {
            this.setState({
              lastNameInputErr: "Last name should not be more 40 characters"
            });
          } else {
            this.setState({
              lastNameInputErr: null,
              lastName: event.target.value
            });
          }
          break;
        case "email":
          this.setState({
            email: event.target.value
          });

          break;
        case "password":
          var password = event.target.value;
          if (
            password.match(/[a-z]/g) &&
            password.match(/[A-Z]/g) &&
            password.match(/[0-9]/g) &&
            password.match(/[^a-zA-Z\d]/g) &&
            password.length >= 8
          ) {
            this.setState({
              password: password,
              disableRegisterBtn: false,
              passwordInputErr: null
            });
          } else {
            this.setState({
              password: password,
              disableRegisterBtn: true,
              passwordInputErr:
                "Password should be of minimum 8 characters and should consist atleat 1 uppercase, 1 lowercase, 1 number & 1 special character."
            });
          }

          break;
        case "confirmPassword":
          var cpassword = event.target.value;
          if (this.state.password === cpassword) {
            this.setState({
              confirmPassword: cpassword,
              disableRegisterBtn: false,
              confirmPasswordInputErr: null
            });
          } else {
            this.setState({
              confirmPassword: cpassword,
              disableRegisterBtn: true,
              confirmPasswordInputErr: "Passwords should match"
            });
          }
          break;
        default:
          break;
      }
    };
    return (
      <React.Fragment>
        <div className="outerReg">
          <Paper className="innerReg" elevation={15}>
            <h3>Sign Up</h3>

            <div className="mb-4">
              <label>First name</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                placeholder="First name"
                value={this.state.firstName}
                onChange={handleValueUpdate}
              />
              <div className="errorLabel">{this.state.firstNameInputErr}</div>
            </div>

            <div className="mb-4">
              <label>Last name</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                placeholder="Last name"
                value={this.state.lastName}
                onChange={handleValueUpdate}
              />
              <div className="errorLabel">{this.state.lastNameInputErr}</div>
            </div>

            <div className="mb-4">
              <label>Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                onChange={handleValueUpdate}
              />
              <div className="errorLabel">{this.state.emailInputErr}</div>
            </div>

            <div className="mb-4">
              <label>Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={this.state.password}
                onChange={handleValueUpdate}
              />
              <div className="errorLabel">{this.state.passwordInputErr}</div>
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Enter password"
                value={this.state.confirmpassword}
                onChange={handleValueUpdate}
              />
              <div className="errorLabel">
                {this.state.confirmPasswordInputErr}
              </div>
            </div>
            {this.state.showErrorMsg && (
              <div className="errorLabel">{this.state.errorMsg}</div>
            )}

            <button
              disabled={
                this.state.firstName === "" ||
                this.state.lastName === "" ||
                this.state.email === "" ||
                this.state.password === "" ||
                this.state.confirmPassword === "" ||
                this.state.disableRegisterBtn
              }
              type="button"
              className="btn btn-lg btn-block w-100 mt-2"
              onClick={e => {
                this.registerUser();
              }}
            >
              Register
            </button>
            <a
              id="loginPageLink"
              className="btn btn-md w-100 mt-3"
              href="/login"
            >
              Already registered?
            </a>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default withCookies(Register);
