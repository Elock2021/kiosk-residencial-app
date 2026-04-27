import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "../components/SignIn";
import Boxes from "../modules/Residential/pages/Boxes";
import Companies from "../modules/Residential/pages/Companies";
import Delivery from "../modules/Residential/pages/Delivery";
import Home from "../modules/Residential/pages/Home";
// import OpenBoxDelivery from "../modules/Residential/pages/OpenBoxDelivery";
import OpenBoxDeliveryServices from "../modules/Residential/pages/OpenBoxDeliveryServices";
import OpenBoxPickup from "../modules/Residential/pages/OpenBoxPickup";
import Pickup from "../modules/Residential/pages/Pickup";
import Services from "../modules/Residential/pages/Services";
import Success from "../modules/Residential/pages/Success";
import DashboardRouter from "./DashboardRouter";
import Apartaments from "../modules/Residential/pages/Apartaments";
import OpenBox from "../modules/Residential/pages/OpenBox";
import Confirmation from "../modules/Residential/pages/Confirmation";
import ApartmentKeyboard from "../modules/Residential/pages/ApartmentKeyboard";
import CustodyKeyboard from "../modules/Residential/pages/CustodyKeyboard";
import OpenBoxCustody from "../modules/Residential/pages/OpenBoxCustody";
import ConfirmationCustody from "../modules/Residential/pages/ConfirmationCustody";

import ReadDocument from "../modules/Residential/pages/Help";
import ApartmentKeyboardWithRedirect from "../modules/Residential/pages/ApartamentKeyboardWithRedirect";
import ApartamentsWithoutCode from "../modules/Residential/pages/ApartamentsWithoutCode";
import PackagesToPickup from "../modules/Residential/pages/PackagesToPickup";
import OpenBoxPickupWithoutCode from "../modules/Residential/pages/OpenBoxPickupWithoutCode";
import NavigationContext from "./NavigationContext";

export default function ResidentialRouter() {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  useEffect(() => {
    import("../modules/Residential/styles/_global_residential.scss");
  }, []);
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <NavigationContext>
        <SignIn open={!session.is_connected || session.sign_in_component} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/available-boxes" element={<Boxes />} />
          <Route path="/companies" element={<Companies />} />
          {/* <Route path="/open-box-delivery" element={<OpenBoxDelivery />} /> */}
          <Route path="/open-box-delivery/:apartment" element={<OpenBox />} />
          <Route path="/open-box-custody/:phone" element={<OpenBoxCustody />} />
          <Route
            path="/services/open-box-delivery-services"
            element={<OpenBoxDeliveryServices />}
          />
          <Route path="/open-box-pickup" element={<OpenBoxPickup />} />
          <Route path="/success" element={<Success />} />
          <Route path="/pickup" element={<Pickup />} />
          <Route path="/info-apartment" element={<ApartmentKeyboard />} />
          <Route path="/info-custody" element={<CustodyKeyboard />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/delivery-with-apartament/:apartment"
            element={<Apartaments />}
          />
          <Route path="/confirmation/:apartment" element={<Confirmation />} />
          <Route
            path="/confirmation/custody/:phone"
            element={<ConfirmationCustody />}
          />
          <Route path="/dashboard/*" element={<DashboardRouter />} />

          {/* Pickup without code */}
          <Route path="/pickup-without-code/rut" element={<ReadDocument />} />
          <Route
            path="/pickup-without-code/info-apartament"
            element={<ApartmentKeyboardWithRedirect />}
          />
          <Route
            path="/pickup-without-code/user-list/:apartment"
            element={<ApartamentsWithoutCode />}
          />
          <Route
            path="/pickup-without-code/packages"
            element={<PackagesToPickup />}
          />
          <Route
            path="/pickup-without-code/packages/pickup"
            element={<OpenBoxPickupWithoutCode />}
          />
        </Routes>
      </NavigationContext>
    </BrowserRouter>
  );
}
