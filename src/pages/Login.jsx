import React, { Component } from "react";
import "../css/login.css";
import Paper from "@material-ui/core/Paper";
import * as api from "../utlis/apiHelper";
import * as helper from "../utlis/helper";
import { withCookies } from "react-cookie";
import CheckListIcon from "@material-ui/icons/DoneAll";
import Grow from "@material-ui/core/Grow";
import Fade from "@material-ui/core/Fade";
// ====================================================== //
// =============== This is the Login Page =============== //
// ====================================================== //

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

  //* To handle user login
  async loginUser() {
    // Checking if email containes "@" or not
    if (this.state.email.includes("@")) {
      this.setState({
        // Clearing the email field error state variable as email is valid
        emailInputErr: null,
        // Clearing the main error state variable as email is valid
        errorMsg: null
      });

      // Creating variable with user details from the login form to pass in the body of the API request to backend
      let data = {
        username: this.state.email,
        password: this.state.password
      };

      // Calling the API to get the auth token on successfull login
      await api.loginUser(data).then(response => {
        if (response !== null) {
          if (response.status === 200 && response.data.code === 0) {
            // Log In Succesfull

            // Storing the JWT token returned by the API in "auth" cookie on successful reponse
            this.props.cookies.set("auth", response.data.token, {
              path: "/"
            });

            // Redirecting user to Home Page
            window.location = "/";
          } else {
            // Log In Failed
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
    //* To handle enter key press
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

    //* To handle email and password field value change
    const handleValueUpdate = event => {
      // Handling different input fields
      switch (event.target.id) {
        // For Email field
        case "email":
          this.setState({
            // Storing Email field value in state variable
            email: event.target.value
          });
          break;

        // For Password field
        case "password":
          this.setState({
            // Storing Password field value in state variable
            password: event.target.value
          });

          break;
        default:
          break;
      }
    };
    return (
      <div className="mainDiv">
        <div className="bgLogin"> </div>
        <div className="outerLogin">
          {this.state.showLoader ? (
            <div />
          ) : (
            <div className="outerLogin">
              <div>
                <Grow in={true} timeout={700}>
                  <div className="innerLogin">
                    <Paper elevation={15} className="paper">
                      <Fade in={true} timeout={800}>
                        <div className="appHeader">
                          <h3>
                            <CheckListIcon
                              fontSize="large"
                              className="checklistIcon"
                            />
                            Checklist Tool
                          </h3>
                        </div>
                      </Fade>
                      <React.Fragment>
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
                            <div className="errorLabel">
                              {this.state.emailInputErr}
                            </div>
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
                            <div className="errorLabel">
                              {this.state.errorMsg}
                            </div>
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
                            Log In
                          </button>
                          <button
                            id="signup"
                            type="button"
                            className="btn btn-lg btn-block w-100 mt-1 signup"
                            onClick={e => {
                              window.location = "/register";
                            }}
                          >
                            Register
                          </button>
                        </form>
                      </React.Fragment>
                    </Paper>
                  </div>
                </Grow>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withCookies(Login);
