import Nav from "./compoents/nav";
import Footer from "./compoents/footer";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "Home";
import Plan from "views/plan";
import Logout from "views/logout";
import Earnings from "views/earnings";

function App() {
  return (
    <BrowserRouter>
      <div className="background-img"></div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/earnings" element={<Earnings />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
