import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { Layout } from "@/components/layout";
import { NotFound } from "@/pages/not-found";
import { ThemeProvider } from "@/components/navbar/theme-provider";
import { Home } from "@/pages/home";
import { Dashboard } from "@/pages/dashboard";
import { Catalog } from "@/pages/catalog";
import { Profile } from "@/pages/my-profile";
import { Login } from "@/pages/login";
import { ForgotPassword } from "./pages/forgot-password";
import { ChangePassword } from "./pages/change-password";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ThemeProvider>
              <Outlet />
            </ThemeProvider>
          }
        >
          <Route
            element={
              <Layout navbar={true}>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/my-profile" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
