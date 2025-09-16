import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import AppRoutes from "./AppRoutes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <Layout>
      <AppRoutes />
    </Layout>
  </BrowserRouter>
);