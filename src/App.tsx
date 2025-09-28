import Nav from "./compoents/nav";
import Footer from "./compoents/footer";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "Home";
import Plan from "views/plan";

function App() {
  return (
    <BrowserRouter>
      <div className="background-img"></div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
