import Nav from "./compoents/nav";
import Footer from "./compoents/footer";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "Home";
import Plan from "views/plan";
import Logout from "views/logout";
import Earnings from "views/earnings";
import ProtectedRoute from "compoents/ProtectedRoute";
import ChangePassword from "views/change-password";
import AdminProtectedRoute from "compoents/AdminProtectedRoute";
import Investments from "views/investments";
import PhoneNumbers from "views/phone-numbers";
import PhoneNumberTxns from "views/phone-numbers-txns";
import CreatePhoneNumber from "views/create-phone-number";

function App() {
  return (
    <BrowserRouter>
      <div className="background-img"></div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/plan" element={<Plan />} />
        <Route
          path="/earnings"
          element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security/password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <AdminProtectedRoute>
              <Investments />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/phoneNumbers"
          element={
            <AdminProtectedRoute>
              <PhoneNumbers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/phoneNumbers/txns/:id"
          element={
            <AdminProtectedRoute>
              <PhoneNumberTxns />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/phoneNumbers/create"
          element={
            <AdminProtectedRoute>
              <CreatePhoneNumber />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
