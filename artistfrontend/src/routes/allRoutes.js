import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import User from "../pages/User/User";

import Pages404 from "../pages/ExtraPages/Pages404";
import Signin from "../pages/Authentication/Signin";
import Artist from "../pages/Artist/Artist";
import ArtistSong from "../pages/Artist/ArtistSong";
import ArtistSongForm from "../pages/Artist/ArtistSongForm";

// Clients
// import ClientList from "components/components/clients/ClientList"

const userRoutes = [
  { path: "/", component: Dashboard },
  { path: "/dashboard", component: Dashboard },
  { path: "/users", component: User },
  { path: "/artists", component: Artist },
  { path: "/user/register", component: Signin },
  { path: "/artist/register", component: Signin },
  { path: "/artist/songs/:id", component: ArtistSong },
  { path: "/my/songs/:id", component: ArtistSong },
  { path: "/artist/songs/create", component: ArtistSongForm },
  //   {
  //     path: "/all-users",
  //     component: allUserList,
  //   },
];

const authRoutes = [
  //   { path: "/register", component: Logout },
  { path: "/login", component: Login },
  { path: "/signup", component: Signin },

  { path: "/pages-404", component: Pages404 },
];

export { userRoutes, authRoutes };
