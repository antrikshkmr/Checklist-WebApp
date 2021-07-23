import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../css/home.css";
import * as api from "../utlis/apiHelper";
import TodoTaskCard from "../components/TodoTaskCard";
import Paper from "@material-ui/core/Paper";
import CompletedTaskCard from "../components/CompletedTaskCard";
import CompletedListIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import mongoose from "mongoose";
import CircularProgress from "@material-ui/core/CircularProgress";
let progressBarInterval;
class Home extends Component {
  state = {
    username: null,
    firstName: null,
    lastName: null,
    _userId: null,
    todoList: [],
    completedList: [],
    circularProgress: true,
    syncingData: true
  };
  getUserData() {
    api
      .getUserProfile()
      .then(async res => {
        if (res !== null && res !== undefined) {
          if (res.code === 0) {
            this.setState({
              _userId: res.data._id,
              username: res.data.username,
              firstName: res.data.firstName,
              lastName: res.data.lastName
            });
            return this.getTasks();
          }
        }
        window.location = "/login";
      })
      .catch(err => {
        console.log(err);
        window.location = "/error";
      });
  }

  getTasks() {
    api
      .getAllTasksByUserId(this.state._userId)
      .then(res => {
        // console.log(res.data);
        if (res !== null) {
          if (res.code === 0) {
            let todo =
              res.data.tasksList.todo === null ? [] : res.data.tasksList.todo;
            let completed =
              res.data.tasksList.completed === null
                ? []
                : res.data.tasksList.completed;
            this.setState({
              todoList: todo,
              completedList: completed,
              circularProgress: false
            });
            clearTimeout(progressBarInterval);
            progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  hideSyncProgressBar = () => {
    this.setState({ syncingData: false });
  };
  componentDidMount() {
    clearTimeout(progressBarInterval);
    this.setState({
      syncingData: true
    });
    this.getUserData();
  }
  render() {
    const handleOnDragEnd = result => {
      if (result.source.index !== 0) {
        if (!result.destination) return;
        const items = Array.from(this.state.todoList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        this.setState({
          todoList: items
        });
        let data = {
          taskName: reorderedItem.taskName,
          type: 1
        };
        this.setState({
          syncingData: true
        });
        api
          .rearrangeTaskList(
            data,
            this.state._userId,
            reorderedItem._id,
            result.destination.index
          )
          .then(async res => {
            clearTimeout(progressBarInterval);
            progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
            console.log(res);
          });
      }
    };
    const handleTaskEdit = (event, index) => {
      let _id = event.target.id;
      let todoList = [...this.state.todoList];
      let itemIndex = parseInt(index);

      todoList[itemIndex].taskName = event.target.value;

      this.setState({
        todoList: todoList
      });
      let data = {
        taskName: event.target.value,
        type: 1
      };
      _id = _id.substr(3);
      if (!this.state.syncingData) {
        this.setState({
          syncingData: true
        });
      }

      api.updateTask(data, this.state._userId, _id).then(async res => {
        clearTimeout(progressBarInterval);
        progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
        console.log(res);
      });
    };

    const handleNewTask = (event, index) => {
      let todoList = [...this.state.todoList];
      let itemIndex = parseInt(index);

      todoList[itemIndex].taskName = event.target.value;
      todoList[itemIndex].type = 1;
      let newObjectId = new mongoose.Types.ObjectId();
      todoList.unshift({
        _id: newObjectId.toString(),
        lastModifiedAt: Date.now,
        type: 0,
        taskName: ""
      });
      let data = {
        _id: newObjectId.toString(),
        taskName: "",
        type: 0
      };
      let _id = event.target.id;
      setTimeout(function() {
        document.getElementById(_id).focus();
      }, 1);
      this.setState({
        todoList: todoList
      });
      this.setState({
        syncingData: true
      });
      api.createNewTask(data, this.state._userId).then(async res => {
        console.log(res);
        data.taskName = document.getElementById(_id).value;
        _id = _id.substr(3);
        data._id = _id;
        data.type = 1;
        await api.updateTask(data, this.state._userId, _id).then(async res => {
          clearTimeout(progressBarInterval);
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);

          console.log(res);
        });
      });
    };

    const handleCheckBox = (event, index) => {
      let _id = event.target.id;
      _id = _id.substr(3);
      let todoList = [...this.state.todoList];
      let completedList = [...this.state.completedList];

      let itemIndex = parseInt(index);
      let taskToBeMoved = todoList[itemIndex];
      let data = {
        taskName: taskToBeMoved.taskName,
        type: 2
      };
      todoList.splice(itemIndex, 1);
      completedList.push(taskToBeMoved);

      this.setState({
        todoList: todoList,
        completedList: completedList
      });
      this.setState({
        syncingData: true
      });
      api.updateTaskStatus(data, this.state._userId, _id).then(async res => {
        clearTimeout(progressBarInterval);
        progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
        console.log(res);
      });
    };

    const handleTaskDelete = (event, index, type, _id) => {
      let itemIndex = parseInt(index);
      _id = _id.substr(4);
      if (type === 1) {
        let todoList = [...this.state.todoList];
        todoList.splice(itemIndex, 1);
        this.setState({
          todoList: todoList
        });
        this.setState({
          syncingData: true
        });
        api.deleteTask(this.state._userId, _id, "todo").then(async res => {
          clearTimeout(progressBarInterval);
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          console.log(res);
        });
      } else {
        let completedList = [...this.state.completedList];
        completedList.splice(itemIndex, 1);
        this.setState({
          completedList: completedList
        });
        this.setState({
          syncingData: true
        });
        api.deleteTask(this.state._userId, _id, "completed").then(async res => {
          clearTimeout(progressBarInterval);
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          console.log(res);
        });
      }
    };
    return (
      <div>
        <Navbar
          syncingData={this.state.syncingData}
          username={this.state.username}
          name={this.state.firstName + " " + this.state.lastName}
        />
        <div className="container">
          <h4 className="mainlistHeader">Items</h4>
          <Paper className="mainCard" elevation={3}>
            {this.state.circularProgress && (
              <div className="circularProgres">
                <CircularProgress style={{ color: "#004d40" }} />
              </div>
            )}

            {this.state.todoList !== null && (
              <div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="items">
                    {provided => (
                      <div
                        className="items"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {this.state.todoList.map(
                          ({ _id, taskName, type }, index) => {
                            return (
                              <Draggable
                                key={_id}
                                draggableId={_id}
                                index={index}
                              >
                                {provided => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TodoTaskCard
                                      taskName={taskName}
                                      type={type}
                                      _id={_id}
                                      index={index}
                                      handleCheckBox={handleCheckBox}
                                      handleTaskEdit={handleTaskEdit}
                                      handleTaskDelete={handleTaskDelete}
                                      handleNewTask={handleNewTask}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
            {this.state.completedList !== null &&
              (this.state.completedList.length > 0 ? (
                <div className="completedSection">
                  <div className="completedlistHeader">
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={11}
                        sm={11}
                        md={12}
                        lg={12}
                        className="gridFlex"
                      >
                        <CompletedListIcon className="completedlistIcon" />
                        <small>
                          {this.state.completedList.length} Completed Item
                          {this.state.completedList.length > 1 && "s"}
                        </small>
                      </Grid>
                    </Grid>
                  </div>
                  {this.state.completedList.map(
                    ({ _id, taskName, type }, index) => {
                      return (
                        <div key={_id}>
                          <CompletedTaskCard
                            taskName={taskName}
                            type={type}
                            _id={_id}
                            index={index}
                            handleTaskDelete={handleTaskDelete}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div></div>
              ))}
          </Paper>
        </div>
      </div>
    );
  }
}

export default Home;
