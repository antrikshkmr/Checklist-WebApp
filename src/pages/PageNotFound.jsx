import React, { Component } from "react";
import "../css/pagenotfound.css";
import WarningIcon from "@material-ui/icons/Warning";

// ====================================================== //
// ============= This is the 404 Error Page ============= //
// ====================================================== //

class PageNotFound extends Component {
  //* This page will open when someones tries to go to a path which does not exist.
  render() {
    return (
      <React.Fragment>
        <div className="outerPNF">
          <div className="innerPNF">
            <div>
              <WarningIcon style={{ height: "180px", width: "180px" }} />
              <h1>404</h1>
              <h3>The page you're looking for does not exist.</h3>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PageNotFound;
