import jwt from "jsonwebtoken";

export async function isSessionActive() {
  let token = getCookie("auth");
  if (token !== null && token !== "" && token !== undefined) {
    try {
      var decodedToken = jwt.decode(token);
      let currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        return { active: false, decodedToken: decodedToken };
      } else {
        return { active: true, decodedToken: decodedToken };
      }
    } catch (err) {
      console.log(err);
      return { active: false, decodedToken: decodedToken };
    }
  }
  return { active: false, decodedToken: decodedToken };
}

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
