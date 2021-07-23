import React from "react";
import { Route, Redirect } from "react-router-dom";
import * as helper from "../utlis/helper";

class ProtectedRoute extends React.Component {
  state = {
    isAuthorized: false,
    isLoggedIn: null
  };

  componentDidMount() {
    helper.isSessionActive().then(response => {
      if (response.active) {
        this.setState({
          isAuthorized: true,
          isLoggedIn: true
        });
      } else {
        this.setState({
          isLoggedIn: false
        });
      }
    });
  }

  render() {

    if (this.state.isLoggedIn != null && this.state.isLoggedIn === false) {
      return <Redirect to={"/login"} />;
    }
    return this.state.isAuthorized ? (
      <Route {...this.props} component={this.props.component} />
    ) : (
      <div />
    );
  }
}

export default ProtectedRoute;
