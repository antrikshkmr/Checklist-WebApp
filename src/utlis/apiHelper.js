import axios from "axios";
import * as helper from "./helper";
import jwt from "jsonwebtoken";

let baseApiUrl = process.env.REACT_APP_BASE_API_URL;

export async function registerUser(data) {
  return await axios
    .post(baseApiUrl + "/register", data, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function loginUser(data) {
  return await axios
    .post(baseApiUrl + "/login", data, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return null;
    });
}
export async function getUserProfile() {
  let token = helper.getCookie("auth");
  if (token !== null && token !== "" && token !== undefined) {
    try {
      var decodedToken = jwt.decode(token);
      if (decodedToken.user !== null || decodedToken.user !== undefined) {
        let data = {
          headers: {
            token: token
          }
        };
        return await axios
          .get(baseApiUrl + "/users/id/" + decodedToken.user.id, data, data)
          .then(response => {
            if (response.data !== null) {
              return response.data;
            }
            return null;
          })
          .catch(error => {
            throw error;
          });
      }
    } catch (err) {
      throw err;
    }
  }
  return null;
}
export async function getAllTasksByUserId(userid) {
  let token = helper.getCookie("auth");
  let data = {
    headers: {
      token: token
    }
  };
  return await axios
    .get(baseApiUrl + "/tasks/" + userid, data, data)
    .then(response => {
      if (response.data !== null) {
        return response.data;
      }
      return null;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function createNewTask(data, _userId) {
  let token = helper.getCookie("auth");
  data = {
    ...data,
    headers: {
      token: token
    }
  };
  return await axios
    .post(baseApiUrl + "/tasks/create/" + _userId, data, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function updateTask(data, _userId, _id) {
  let token = helper.getCookie("auth");
  data = {
    ...data,
    headers: {
      token: token
    }
  };
  return await axios
    .post(baseApiUrl + "/tasks/update/" + _userId + "/todo/" + _id, data, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function deleteTask(_userId, _id, type) {
  let token = helper.getCookie("auth");
  let data = {
    headers: {
      token: token
    }
  };
  return await axios
    .post(
      baseApiUrl + "/tasks/delete/" + _userId + "/" + type + "/" + _id,
      data,
      data
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function updateTaskStatus(data, _userId, _id) {
  let token = helper.getCookie("auth");
  data = {
    ...data,
    headers: {
      token: token
    }
  };
  return await axios
    .post(baseApiUrl + "/tasks/updatestatus/" + _userId + "/" + _id, data, data)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

export async function rearrangeTaskList(data, _userId, _id, position) {
  let token = helper.getCookie("auth");
  data = {
    ...data,
    headers: {
      token: token
    }
  };
  return await axios
    .post(
      baseApiUrl + "/tasks/rearrange/" + _userId + "/" + _id + "/" + position,
      data,
      data
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}
