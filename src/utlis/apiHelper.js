import axios from "axios";
import * as helper from "./helper";
import jwt from "jsonwebtoken";

// ====================================================== //
// = This file contains all the API calls to the backend  //
// ====================================================== //

// Getting the base API url from the environment variable
let baseApiUrl = process.env.REACT_APP_BASE_API_URL;

//* To handle user registration
export async function registerUser(data) {
  // POST API call to create a new user
  return await axios
    .post(baseApiUrl + "/register", data, data)
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To handle user login
export async function loginUser(data) {
  // POST API call to get auth token based on succesfull verfication of the usr credentials
  return await axios
    .post(baseApiUrl + "/login", data, data)
    .then(response => {
      // Return the response from the backend
      return response;
    })

    .catch(error => {
      //! Throw and log the exception
      console.log(error);
      return null;
    });
}

//* To get the user profile
export async function getUserProfile() {
  let token = helper.getCookie("auth");
  if (token !== null && token !== "" && token !== undefined) {
    try {
      // Decoding the JWT token
      var decodedToken = jwt.decode(token);

      // If token is valid
      if (decodedToken.user !== null || decodedToken.user !== undefined) {
        // Store the token in a temporary variable to pass in the header of the request
        let data = {
          headers: {
            token: token
          }
        };

        // GET API call to get account details of a user
        return await axios
          .get(baseApiUrl + "/users/id/" + decodedToken.user.id, data, data)
          .then(response => {
            // Return the response from the backend if it's not empty
            if (response.data !== null) {
              return response.data;
            }

            // Return empty response if backend response is empty
            return null;
          })

          .catch(error => {
            //! Throw exception
            throw error;
          });
      }
    } catch (err) {
      // Throw exception if there was an issue while decoding the token
      throw err;
    }
  }

  // Return null if the cookie with the token does not exist
  return null;
}

//* To get the list of items for a specific user
export async function getAllTasksByUserId(userid) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");

  // Store the token in a temporary variable to pass in the header of the request
  let data = {
    headers: {
      token: token
    }
  };

  // GET API call to get checklist items of a user
  return await axios
    .get(baseApiUrl + "/tasks/" + userid, data, data)
    .then(response => {
      // Return the response from the backend if it's not empty
      if (response.data !== null) {
        return response.data;
      }

      // Return empty response if backend response is empty
      return null;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To create a new item in the checklist for a user
export async function createNewTask(data, _userId) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");

  data = {
    // Data for the request body
    ...data,

    // Store the token to pass in the header of the request
    headers: {
      token: token
    }
  };

  // POST API call to create a new checlist item for a user
  return await axios
    .post(baseApiUrl + "/tasks/create/" + _userId, data, data)
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To update an existing item in the checklist in the database
export async function updateTask(data, _userId, _id) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");
  data = {
    // Data for the request body
    ...data,

    // Store the token to pass in the header of the request
    headers: {
      token: token
    }
  };

  // POST API call to update an existing checlist item for a user
  return await axios
    .post(baseApiUrl + "/tasks/update/" + _userId + "/todo/" + _id, data, data)
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To delete an existing item in the checklist from the database
export async function deleteTask(_userId, _id, type) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");

  // Store the token in a temporary variable to pass in the header of the request
  let data = {
    headers: {
      token: token
    }
  };

  // POST API call to delete an existing checlist item for a user
  return await axios
    .post(
      baseApiUrl + "/tasks/delete/" + _userId + "/" + type + "/" + _id,
      data,
      data
    )
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To update an existing item status from todo to completed for a user
export async function updateTaskStatus(data, _userId, _id) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");
  data = {
    // Data for the request body
    ...data,

    // Store the token to pass in the header of the request
    headers: {
      token: token
    }
  };

  // POST API call to update the status of an existing checlist item  to completed for a user
  return await axios
    .post(baseApiUrl + "/tasks/updatestatus/" + _userId + "/" + _id, data, data)
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}

//* To update the position of an existing item in the checklist
export async function rearrangeTaskList(data, _userId, _id, position) {
  // To get the token stored in "auth" cookie
  let token = helper.getCookie("auth");
  data = {
    // Data for the request body
    ...data,

    // Store the token to pass in the header of the request
    headers: {
      token: token
    }
  };

  // POST API call to change the position of an existing checlist item for a user
  return await axios
    .post(
      baseApiUrl + "/tasks/rearrange/" + _userId + "/" + _id + "/" + position,
      data,
      data
    )
    .then(response => {
      // Return the response from the backend
      return response;
    })
    .catch(error => {
      //! Throw and log the exception
      console.log(error);
    });
}
