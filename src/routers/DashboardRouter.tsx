import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardHome from "../pages/dashboard/DashboardHome";
import SignInQr from "../pages/SignInQr";

const DashboardRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/orders" element={<Navigate to="/dashboard" replace />} />
      <Route path="/doors" element={<Navigate to="/dashboard" replace />} />
      <Route path="/version" element={<Navigate to="/dashboard" replace />} />
      <Route path="/signin/qr" element={<SignInQr />} />
    </Routes>
  );
};

export default DashboardRouter;
