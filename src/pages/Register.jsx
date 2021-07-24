import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "../css/register.css";
import * as api from "../utlis/apiHelper";
import { withCookies } from "react-cookie";
import Grow from "@material-ui/core/Grow";

// ====================================================== //
// ============ This is the Registration Page =========== //
// ====================================================== //

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

  //* To handle user registration
  async registerUser() {
    // Checking if email is valid or not based on REGEX
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.state.email
      )
    ) {
      this.setState({
        // Clearing the email field error state variable as email is valid
        emailInputErr: null,

        // Clearing the main error state variable as email is valid
        errorMsg: null
      });

      // Creating variable with user details from the registration form to pass in the body of the API request to backend
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.email,
        password: this.state.password
      };

      // Calling the API to create a new user account in the database
      await api.registerUser(data).then(response => {
        if (response !== null) {
          if (response.status === 200 && response.data.code === 0) {
            // Registration Succesfull

            // Storing the JWT token returned by the API in "auth" cookie on successful reponse
            this.props.cookies.set("auth", response.data.token, {
              path: "/"
            });

            // Redirecting user to Home Page
            window.location = "/";
          } else {
            // Registration Failed

            this.setState({
              // Enabling error message on UI
              showErrorMsg: true,

              // Storing the error the error message returned by the API in state variable
              errorMsg: response.data.message
            });
          }
        }
      });
    } else {
      // Email not valid
      this.setState({
        // Setting error message for UI
        emailInputErr: "Invalid email address"
      });
    }
  }
  render() {
    //* To handle change in data from input fields in the registration form
    const handleValueUpdate = event => {
      // Handling different input fields
      switch (event.target.id) {
        // For First Name field
        case "firstName":
          // If text length is more than 40 chars
          if (event.target.value.length > 40) {
            this.setState({
              // Setting the error message
              firstNameInputErr: "First name should not be more 40 characters"
            });
          }

          // If text length is not more than 40 chars
          else {
            this.setState({
              // Resetting the error message state variable
              firstNameInputErr: null,

              // Storing First Name field value in state variable
              firstName: event.target.value
            });
          }

          break;

        // For Last Name field
        case "lastName":
          // If text length is more than 40 chars
          if (event.target.value.length > 40) {
            this.setState({
              // Setting the error message
              lastNameInputErr: "Last name should not be more 40 characters"
            });
          }

          // If text length is not more than 40 chars
          else {
            this.setState({
              // Resetting the error message state variable
              lastNameInputErr: null,

              // Storing Last Name field value in state variable
              lastName: event.target.value
            });
          }
          break;

        // For Email field
        case "email":
          this.setState({
            // Storing Email field value in state variable
            email: event.target.value
          });

          break;

        // For Password field
        case "password":
          var password = event.target.value;

          // If password is of minimum 8 chars and consists atleast 1 uppercase, 1 lowercase, 1 number & 1 special character
          if (
            password.match(/[a-z]/g) &&
            password.match(/[A-Z]/g) &&
            password.match(/[0-9]/g) &&
            password.match(/[^a-zA-Z\d]/g) &&
            password.length >= 8
          ) {
            this.setState({
              // Storing Password field value in state variable
              password: password,

              // Enable Register button
              disableRegisterBtn: false,

              // Resetting the error message state variable
              passwordInputErr: null
            });
          }

          // If invalid password
          else {
            this.setState({
              // Storing Password field value in state variable for UI
              password: password,

              // Keep the Register button disabled
              disableRegisterBtn: true,

              // Setting the error message
              passwordInputErr:
                "Password should be of minimum 8 characters and should consist atleast 1 uppercase, 1 lowercase, 1 number & 1 special character."
            });
          }

          break;

        // For Confirm Password field
        case "confirmPassword":
          var cpassword = event.target.value;

          // If Confirm Passord fieled value matches to the value in Password field
          if (this.state.password === cpassword) {
            this.setState({
              // Storing Confirm Password field value in state variable
              confirmPassword: cpassword,

              // Enable Register button
              disableRegisterBtn: false,

              // Resetting the error message state variable
              confirmPasswordInputErr: null
            });
          }
          // If Confirm Passord fieled value does not match the value in Password field
          else {
            this.setState({
              // Storing Confirm Password field value in state variable for UI
              confirmPassword: cpassword,

              // Keep the Register button disabled
              disableRegisterBtn: true,

              // Setting the error message
              confirmPasswordInputErr: "Passwords should match"
            });
          }
          break;
        default:
          break;
      }
    };
    return (
      <div className="mainDiv">
        <div className="bgReg"> </div>
        <div className="outerReg">
          <Grow in={true} timeout={700}>
            <Paper className="innerReg" elevation={15}>
              <h3>Create Account</h3>

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
              <button
                id="loginPageLink"
                type="button"
                className="btn btn-lg btn-block w-100 mt-3"
                onClick={e => {
                  window.location = "/login";
                }}
              >
                Already registered?
              </button>
            </Paper>
          </Grow>
        </div>
      </div>
    );
  }
}

export default withCookies(Register);
