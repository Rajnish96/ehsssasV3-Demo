import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
export const ProtectedRoute = () => {
  const isLoggedIn = window.sessionStorage.getItem("user_Token")
  useEffect(() => {
    if (isLoggedIn && window.location.pathname === "/") {
      window.location.replace("/advancedelements");
    }
  }, []);
  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div
          className="wrapper"
          style={{ height: "auto", minHeight: "100%" }}
          data-select2-id="19"
        >
          <Header />
          <Sidebar />
          <Outlet />
          <Footer />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </React.Fragment>
  );
};

export const HomeRouter = () => {
  const isLoggedIn = window.sessionStorage.getItem("user_Token")
  useEffect(() => {
    if (!isLoggedIn && window.location.pathname === "/") {
      window.location.replace("/login");
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Outlet /> : <Navigate to="/advancedelements" />}
    </React.Fragment>
  );
};
