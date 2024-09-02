import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  const location = useLocation();

  if (isAuthProtected && !localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
};

export default Authmiddleware;
