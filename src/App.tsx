import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Login from "./pages/Login";
import Transcript from "./pages/Transcript";
import "./App.css";
import MainLayout from "./layout/MainLayout";
export default function App() {
  const Router = () =>
    useRoutes([
      {
        path: "/",
        element: <Login />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/transcript",
            element: <Transcript />,
          },
        ],
      },
    ]);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
