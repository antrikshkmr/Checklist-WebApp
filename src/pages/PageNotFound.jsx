import React, { Component } from "react";
import "../css/pagenotfound.css";
import WarningIcon from "@material-ui/icons/Warning";

class PageNotFound extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="outerPNF">
          <div className="innerPNF">
            <div>
              <WarningIcon
                className="errorIcon"
                style={{ height: "180px", width: "180px" }}
              />
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
