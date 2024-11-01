import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Login from "./pages/Login";
import Transcript from "./pages/Transcript";

export default function App() {
  const Router = () =>
    useRoutes([
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/transcript",
        element: <Transcript />,
      },
    ]);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
