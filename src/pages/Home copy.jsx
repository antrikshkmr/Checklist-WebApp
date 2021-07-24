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
import Grow from "@material-ui/core/Grow";

// ====================================================== //
// ====== This is the Home Page of the application ====== //
// ====================================================== //

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

  //* To fetch the user details and the checklist itmes under that account
  getUserData() {
    api
      .getUserProfile()
      .then(async res => {
        if (res !== null && res !== undefined) {
          if (res.code === 0) {
            // On getting successfull response from the backend, state variables are set accordingly with the user's details.
            this.setState({
              _userId: res.data._id,
              username: res.data.username,
              firstName: res.data.firstName,
              lastName: res.data.lastName
            });

            // Getting the checlist items under the user's account
            return this.getTasks();
          }
        }

        //! If an active user profile and session is not found or there is some error due to which the frontend is not able to get the user profile, the user gets redirected to the login screen.
        window.location = "/login";
      })
      .catch(err => {
        console.log(err);

        //! If an exception occurs due to which the frontend is not able to get the user profile, the user gets redirected to the error screen.
        window.location = "/error";
      });
  }

  //* To fetch the user's checklist itmes under that account
  getTasks() {
    api
      .getAllTasksByUserId(this.state._userId)
      .then(res => {
        if (res !== null) {
          if (res.code === 0) {
            //On getting successfull response from the backend, state variables are set accordingly for both todo and completed lists.
            let todo =
              res.data.tasksList.todo === null ? [] : res.data.tasksList.todo;
            let completed =
              res.data.tasksList.completed === null
                ? []
                : res.data.tasksList.completed;
            this.setState({
              // Storing the todo items in state
              todoList: todo,

              // Storing the completed items in state
              completedList: completed,

              // Disabling the loading animation
              circularProgress: false
            });

            // Clearing existing timeout interval
            clearTimeout(progressBarInterval);

            // Disabling sync progress bar and icon on NavBar after 1.2 sec
            progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  //* To disable sync progress bar and icon on NavBar
  hideSyncProgressBar = () => {
    this.setState({ syncingData: false });
  };

  componentDidMount() {
    // Clearing existing timeout interval
    clearTimeout(progressBarInterval);
    this.setState({
      // Enabling sync progress bar and icon on NavBar
      syncingData: true
    });
    // Getting the current user's details and the checklist items under that account
    this.getUserData();
  }
  render() {
    //* For handling draggable todo list items
    const handleOnDragEnd = result => {
      // If condition to disable drag and drop functionality for the first item in the list .i.e, add new item input field
      if (result.source.index !== 0) {
        if (!result.destination) return;

        // Getting todo list items from state and storing it in a constant
        const items = Array.from(this.state.todoList);

        // Splicing the todo list according to the original position of the item to get the reordered item
        const [reorderedItem] = items.splice(result.source.index, 1);

        // Splicing the todo list according to the destination position of the reordered item
        items.splice(result.destination.index, 0, reorderedItem);
        this.setState({
          // Setting the updated todo list to the state variable
          todoList: items,

          // Enabling sync progress bar and icon on NavBar
          syncingData: true
        });

        // Creating variable to pass in the body of the API request to backend
        let data = {
          taskName: reorderedItem.taskName,
          type: 1
        };

        // Calling the API to update the new position of the reordered item in the database
        api
          .rearrangeTaskList(
            data,
            this.state._userId,
            reorderedItem._id,
            result.destination.index
          )
          .then(async res => {
            // Clearing existing timeout interval
            clearTimeout(progressBarInterval);

            // Disabling sync progress bar and icon on NavBar
            progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
            console.log(res);
          });
      }
    };

    //* For handling the editing of text in the inline input field of an item in the todo list
    const handleTaskEdit = (event, index) => {
      // Getting the item id
      let _id = event.target.id;

      // Storing todo list items in a temporary variable
      let todoList = [...this.state.todoList];

      // Parsing index of type sting to int
      let itemIndex = parseInt(index);

      // Updating the updated text for that item in the temporary variable
      todoList[itemIndex].taskName = event.target.value;

      this.setState({
        // Setting the updated todo list to the state variable
        todoList: todoList
      });

      // Creating variable to pass in the body of the API request to backend
      let data = {
        taskName: event.target.value,
        type: 1
      };

      // Removing first three characters "tf_" from the id of that item
      _id = _id.substr(3);

      this.setState({
        // Enabling sync progress bar and icon on NavBar
        syncingData: true
      });

      // Calling the API to push the updated text of the item in the database
      api.updateTask(data, this.state._userId, _id).then(async res => {
        // Clearing existing timeout interval
        clearTimeout(progressBarInterval);

        // Disabling sync progress bar and icon on NavBar
        progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
        console.log(res);
      });
    };

    //* For handling creation of new items in todo list
    const handleNewTask = (event, index) => {
      // Storing todo list items in a temporary variable
      let todoList = [...this.state.todoList];

      // Parsing index of type sting to int
      let itemIndex = parseInt(index);

      // Updating the updated text for that item in the temporary variable
      todoList[itemIndex].taskName = event.target.value;

      // Updating the type of the item to 1 to move it from dummy state in the list
      todoList[itemIndex].type = 1;

      // Creating a new random object id to add a new dummy item in the list
      let newObjectId = new mongoose.Types.ObjectId();

      // Pushing the dummy item to the top of the todo list with type set to 0
      todoList.unshift({
        _id: newObjectId.toString(),
        lastModifiedAt: Date.now,
        type: 0,
        taskName: ""
      });

      // Creating variable to pass in the body of the API request to backend
      let data = {
        _id: newObjectId.toString(),
        taskName: "",
        type: 0
      };

      // Getting the item id
      let _id = event.target.id;

      // To bring the new task item's inline input field to focus automatically for continuity
      setTimeout(function() {
        document.getElementById(_id).focus();
      }, 1);
      this.setState({
        // Setting the updated todo list to the state variable
        todoList: todoList,

        //Enabling sync progress bar and icon on NavBar
        syncingData: true
      });

      // Calling the API to create a new dummy item in the database under todo list
      api.createNewTask(data, this.state._userId).then(async res => {
        console.log(res);

        // Getting the newly created item's id
        data.taskName = document.getElementById(_id).value;

        // Removing first three characters "tf_" from the id of the item
        _id = _id.substr(3);
        data._id = _id;
        data.type = 1;

        // Calling the API to push the newly created checklist item in the database
        await api.updateTask(data, this.state._userId, _id).then(async res => {
          // Clearing existing timeout interval
          clearTimeout(progressBarInterval);

          // Disabling sync progress bar and icon on NavBar
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          console.log(res);
        });
      });
    };

    //* To handle movement of items from todo to completed state
    const handleCheckBox = (event, index) => {
      // Getting the item id
      let _id = event.target.id;

      // Removing first three characters "cb_" from the id of the item
      _id = _id.substr(3);

      // Storing todo list items in a temporary variable
      let todoList = [...this.state.todoList];

      // Storing completed list items in a temporary variable
      let completedList = [...this.state.completedList];

      // Parsing index of type sting to int
      let itemIndex = parseInt(index);

      // Storing the item to be moved in a temporary variabled
      let taskToBeMoved = todoList[itemIndex];

      // Creating variable to pass in the body of the API request to backend
      let data = {
        taskName: taskToBeMoved.taskName,
        type: 2
      };

      // Removing the item to be moved from the todo list
      todoList.splice(itemIndex, 1);

      // Pushing the item to completed list
      completedList.push(taskToBeMoved);

      this.setState({
        // Setting the updated todo list to the state variable
        todoList: todoList,

        // Setting the updated completed list to the state variable
        completedList: completedList,

        // Enabling sync progress bar and icon on NavBar
        syncingData: true
      });

      // Calling the API to move the item from todo to completed status in the database
      api.updateTaskStatus(data, this.state._userId, _id).then(async res => {
        // Clearing existing timeout interval
        clearTimeout(progressBarInterval);

        // Disabling sync progress bar and icon on NavBar
        progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
        console.log(res);
      });
    };

    //* To handle deletion of an item from todo and completed lists
    const handleTaskDelete = (event, index, type, _id) => {
      // Parsing index of type sting to int
      let itemIndex = parseInt(index);

      // Removing first four characters "del_" from the id of the item
      _id = _id.substr(4);

      // If item is in todo list
      if (type === 1) {
        // Storing todo list items in a temporary variable
        let todoList = [...this.state.todoList];

        // Removing the item from the todo list
        todoList.splice(itemIndex, 1);
        this.setState({
          // Setting the updated todo list to the state variable
          todoList: todoList,

          // Enabling sync progress bar and icon on NavBar
          syncingData: true
        });

        // Calling the API to delete the item from todo list in the database
        api.deleteTask(this.state._userId, _id, "todo").then(async res => {
          // Clearing existing timeout interval
          clearTimeout(progressBarInterval);

          // Disabling sync progress bar and icon on NavBar
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          console.log(res);
        });
      }

      // If item is in completed list
      else {
        // Storing completed list items in a temporary variable
        let completedList = [...this.state.completedList];

        // Removing first four characters "del_" from the id of the item
        completedList.splice(itemIndex, 1);
        this.setState({
          // Setting the updated completed list to the state variable
          completedList: completedList,

          // Enabling sync progress bar and icon on NavBar
          syncingData: true
        });
        // Calling the API to delete the item from completed list in the database
        api.deleteTask(this.state._userId, _id, "completed").then(async res => {
          // Clearing existing timeout interval
          clearTimeout(progressBarInterval);

          // Disabling sync progress bar and icon on NavBar
          progressBarInterval = setTimeout(this.hideSyncProgressBar, 1200);
          console.log(res);
        });
      }
    };
    return (
      <div className="main">
        {/* Navbar component */}
        <Navbar
          syncingData={this.state.syncingData}
          username={this.state.username}
          name={this.state.firstName + " " + this.state.lastName}
        />
        <div className="bg"></div>
        <div className="outer">
          <div className="container">
            <h4 className="mainlistHeader">Items</h4>
            <Grow in={true} timeout={1000}>
              <Paper className="mainCard" elevation={3}>
                {this.state.circularProgress && (
                  <div className="circularProgres">
                    <CircularProgress style={{ color: "#82142f" }} />
                  </div>
                )}

                {/* Todo Item List */}
                {this.state.todoList !== null && (
                  <div>
                    {/* Draggable Component */}
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
                                        {/* Todo task item card component */}
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

                {/* Completed Item List */}
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
                              {/* Completed task item card component */}
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
            </Grow>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
