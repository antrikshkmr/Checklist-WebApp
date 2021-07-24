import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import ErrorPage from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Switch>
        {/* Route to Login Page */}
        <Route path="/login" component={Login} />

        {/* Route to Registration Page */}
        <Route path="/register" component={Register} />

        {/* Route to Error Page */}
        <Route path="/error" component={ErrorPage} />

        {/* Route to Home Page */}
        <ProtectedRoute exact path="/" component={Home} />

        {/* Route to 404 Page */}
        <Route path="/pagenotfound" component={PageNotFound} />

        {/* Redirect user to /pagenotfound path if user tries to go to a path which does not exist */}
        <Route>
          <Redirect to={"/pagenotfound"} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
