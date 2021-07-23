import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AddIcon from "@material-ui/icons/Add";
import "../css/home.css";

class TodoTaskCard extends Component {
  render() {
    return (
      <div>
        {this.props.type === 0 ? (
          <div className="newTaskDiv">
            <Grid container spacing={3}>
              <Grid item xs={11} sm={11} md={12} lg={12} className="gridFlex">
                <AddIcon className="addIcon" />
                <input
                  placeholder={"Add Item"}
                  type="text"
                  id={"tf_" + this.props._id}
                  className="newTaskTextField"
                  value={this.props.taskName}
                  onChange={event =>
                    this.props.handleNewTask(event, this.props.index)
                  }
                />
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className="taskCard">
            <Grid container spacing={3}>
              <Grid item xs={10} sm={10} md={11} lg={11} className="gridFlex">
                <div className="dragIconDiv">
                  <DragIndicatorIcon className="dragIndicatorIcon showOnHover" />
                </div>
                <Checkbox
                  style={{ color: "#004d40" }}
                  id={"cb_" + this.props._id}
                  onChange={event =>
                    this.props.handleCheckBox(event, this.props.index)
                  }
                  color="primary"
                />
                <input
                  type="text"
                  id={"tf_" + this.props._id}
                  className="taskEditField"
                  value={this.props.taskName}
                  onChange={event =>
                    this.props.handleTaskEdit(event, this.props.index)
                  }
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
                      1,
                      "del_" + this.props._id
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default TodoTaskCard;
