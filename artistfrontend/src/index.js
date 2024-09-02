import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 3 * 60 * 1000,
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container); // Create a root.

const app = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ToastContainer theme="colored" />
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);

root.render(app); // Render the app to the root.
