import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ProtectedRoute from "./ProtectedRoute";

const LoginRoutes = ({ data, setData, loggedIn, setLoggedIn }) => {
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute loggedIn={loggedIn} authRoute={true}>
              <Login data={data} setLoggedIn={setLoggedIn} setData={setData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute loggedIn={loggedIn} authRoute={true}>
              <Register />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default LoginRoutes;
