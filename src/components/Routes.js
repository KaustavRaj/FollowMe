import React from "react";
import {
  Route as PublicRoute,
  BrowserRouter,
  Redirect,
  Switch,
} from "react-router-dom";

// Import all pages
import AdminPage from "../pages/dashboard";
import JoinPage from "../pages/join";
import ProfilePage from "../pages/profile";

// Routes which only auth user can access
function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useUser();

  return (
    <PublicRoute
      {...rest}
      render={(props) =>
        user.profile !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/join", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

// Routes which only non-auth user can access
function ProtectedRoute({ component: Component, ...rest }) {
  const { user } = useUser();

  return (
    <PublicRoute
      {...rest}
      render={(props) =>
        user.profile === null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
}

export default function BaseRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/join" component={JoinPage} />
        <PrivateRoute exact path="/dashboard" component={AdminPage} />
        <PublicRoute path="/:profile" component={ProfilePage} />
      </Switch>
    </BrowserRouter>
  );
}
