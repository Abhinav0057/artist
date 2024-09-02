import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";

// Dashboard
// import Dashboard from "../pages/Dashboard/index"

import Pages404 from "../pages/ExtraPages/Pages404";

// Clients
// import ClientList from "components/components/clients/ClientList"

const userRoutes = [
  //   { path: "/", component: Dashboard },
  //   { path: "/dashboard", component: Dashboard },
  //   {
  //     path: "/all-users",
  //     component: allUserList,
  //   },
];

const authRoutes = [
  //   { path: "/register", component: Logout },
  { path: "/login", component: Login },

  { path: "/pages-404", component: Pages404 },
];

export { userRoutes, authRoutes };
