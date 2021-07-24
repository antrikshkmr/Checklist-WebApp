import jwt from "jsonwebtoken";

// ============================================================================================== //
// =================== This file has common methods being used by different pages ================== //
// ============================================================================================== //

//* To check if a user's session is active
export async function isSessionActive() {
  // Get token from "auth" cookie
  let token = getCookie("auth");

  // If token is found
  if (token !== null && token !== "" && token !== undefined) {
    try {
      // Decode the JWT token
      var decodedToken = jwt.decode(token);
      let currentDate = new Date();

      // If exipiry datetime of the token is earlier than the current datetime
      if (decodedToken.exp * 1000 < currentDate.getTime()) {

        // Return the session status as inactive
        return { active: false, decodedToken: decodedToken };
      }

      // If token is valid
      else {

        // Return the session status as active
        return { active: true, decodedToken: decodedToken };
      }
    } catch (err) {

      //! Return the session status as inactive if an exception occured
      console.log(err);
      return { active: false, decodedToken: decodedToken };
    }
  }

  // If token is not found
  return { active: false, decodedToken: decodedToken };
}

//* To get the data stored in a cookie by name
export function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
