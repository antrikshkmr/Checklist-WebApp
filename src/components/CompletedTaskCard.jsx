import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
import "../css/home.css";
// ====================================================== //
// = This is the component for Completed List Item Card = //
// ====================================================== //

class CompletedTaskCard extends Component {
  render() {
    return (
      <Fade in={true} timeout={1000}>
        <div className="taskCard">
          <Grid container spacing={3}>
            <Grid item xs={10} sm={10} md={11} lg={11} className="gridFlex">
              <div className="dragIconDiv" />
              <Checkbox disabled checked={true} id={"cb_" + this.props._id} />

              <input
                type="text"
                disabled
                id={"tf_" + this.props._id}
                className="taskEditField"
                value={this.props.taskName}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={1} lg={1} className="text-end">
              <IconButton
                id={"del_" + this.props._id}
                className="deleteIcon"
                onClick={event =>
                  this.props.handleTaskDelete(
                    event,
                    this.props.index,
                    2,
                    "del_" + this.props._id
                  )
                }
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      </Fade>
    );
  }
}

export default CompletedTaskCard;
