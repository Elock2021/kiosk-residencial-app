import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardDoors from "../pages/dashboard/DashboardDoors";
import DashboardOrders from "../pages/dashboard/DashboardOrders";
import DashboardHome from "../pages/dashboard/DashboardHome";
import SignInQr from "../pages/SignInQr";
import DashboardVersion from "../pages/dashboard/DashboardVersion";

const DashboardRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="/orders" element={<DashboardOrders />} />
      <Route path="/doors" element={<DashboardDoors />} />
      <Route path="/version" element={<DashboardVersion />} />
      <Route path="/signin/qr" element={<SignInQr />} />
    </Routes>
  );
};

export default DashboardRouter;
