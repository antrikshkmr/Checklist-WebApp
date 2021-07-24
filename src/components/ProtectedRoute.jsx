import React from "react";
import { Route, Redirect } from "react-router-dom";
import * as helper from "../utlis/helper";

// ============================================================================================================================ //
// ============ This component is used to handle routes which should not be accessible when user has not logged in ============ //
// ============================================================================================================================ //

class ProtectedRoute extends React.Component {
  state = {
    isAuthorized: false,
    isLoggedIn: null
  };

  componentDidMount() {
    // To check whether there is an active user session or not
    helper.isSessionActive().then(response => {
      if (response.active) {
        // If session is found
        this.setState({
          isAuthorized: true,
          isLoggedIn: true
        });
      } else {
        // If session is not found
        this.setState({
          isLoggedIn: false
        });
      }
    });
  }

  render() {
    if (this.state.isLoggedIn != null && this.state.isLoggedIn === false) {
      // Redirect to Login Page if no session found
      return <Redirect to={"/login"} />;
    }
    return this.state.isAuthorized ? (
      // Continue to the route which the user requested for
      <Route {...this.props} component={this.props.component} />
    ) : (
      // Do nothing while session is being checked
      <div />
    );
  }
}

export default ProtectedRoute;
