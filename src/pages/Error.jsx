import React, { Component } from "react";
import "../css/errorpage.css";
import WarningIcon from "@material-ui/icons/Warning";

// ====================================================== //
// =============== This is the Error Page =============== //
// ====================================================== //

class Error extends Component {
  //* This page will open when frontend is not able to connect to backend server due to some reason
  render() {
    return (
      <React.Fragment>
        <div className="outerErr">
          <div className="innerErr">
            <div>
              <WarningIcon
                className="errorIcon"
                style={{ height: "180px", width: "180px" }}
              />
              <h3>Oops! Something went wrong. Please try again.</h3>
              <a className="btn btn-md mt-3" href="/">
                <h5> RETRY</h5>
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Error;
