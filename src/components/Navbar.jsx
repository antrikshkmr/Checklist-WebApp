import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CheckListIcon from "@material-ui/icons/DoneAll";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withCookies } from "react-cookie";
import { withStyles } from "@material-ui/core/styles";
import "../css/navbar.css";

// ====================================================== //
// ====== This is the top Navigation Bar component ====== //
// ====================================================== //

const CustomLinearProgressBar = withStyles(theme => ({
  root: {
    height: 3
  },
  colorPrimary: {
    backgroundColor: "white"
  },
  bar: {
    backgroundColor: "#82142f"
  }
}))(LinearProgress);
class Navbar extends Component {
  render() {
    //* To handle logout
    const handleLogout = () => {
      // Delete the cookie with token
      this.props.cookies.remove("auth", { path: "/" });

      // Redirect user to Login Page
      window.location = "/login";
    };
    return (
      <div className="rootDiv">
        <AppBar>
          <Toolbar className="toolbar">
            {this.props.syncingData ? (
              <div className="circularProgres">
                <CircularProgress
                  style={{
                    color: "white",
                    height: "16px",
                    width: "16px",
                    marginRight: "18px"
                  }}
                />
              </div>
            ) : (
              <CheckListIcon className="checklistIcon" />
            )}
            <Typography
              variant="h6"
              className="title"
              onClick={e => (window.location = "/")}
            >
              Checklist Tool
            </Typography>
            {window.screen.width >= 675 && (
              <div className="nameDisplay">
                <b>{this.props.name}</b>&nbsp;({this.props.username})
              </div>
            )}

            <div className="logoutBtn">
              |&nbsp;
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Toolbar>
          {this.props.syncingData && <CustomLinearProgressBar />}
        </AppBar>
      </div>
    );
  }
}

export default withCookies(Navbar);
