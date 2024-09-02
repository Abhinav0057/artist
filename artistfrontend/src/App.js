import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Routes
import { userRoutes, authRoutes } from "./routes/allRoutes";

// Layouts

import AuthLayout from "./components/AuthLayout";
import NonAuthLayout from "./components/NonAuthLayout";

// Middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

const App = (props) => {
  return (
    <React.Fragment>
      <Routes>
        {authRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware
                component={route.component}
                layout={NonAuthLayout}
                isAuthProtected={false}
              />
            }
          />
        ))}

        {userRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware
                component={route.component}
                layout={AuthLayout}
                isAuthProtected={true}
              />
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default App;
