import React from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";

const MainLayout = () => {
  return (
    <div>
      <div className="app-layout">
        {/* <Header /> */}
        <div className="layout-content">
          <Grid container>
            <Grid item xs={12} md={3} >
              <SideBar />
            </Grid>
            <Grid item xs={12} md={9} >
              <div className="main-content">
                <Outlet /> {/* This is where nested routes will be rendered */}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
