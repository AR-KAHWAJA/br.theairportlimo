import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import About from "./pages/About.jsx";
import Affiliates from "./pages/Affiliates.jsx";
import Contact from "./pages/Contact.jsx";
import Customers from "./pages/Customers.jsx";
import Drivers from "./pages/Drivers.jsx";
import Fleet from "./pages/Fleet.jsx";
import GetApp from "./pages/GetApp.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Services from "./pages/Services.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/" element={<Services />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/" element={<Customers />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/" element={<Drivers />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/affiliates/" element={<Affiliates />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/" element={<About />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about-us/" element={<About />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/fleet/" element={<Fleet />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contact-us/" element={<Contact />} />
          <Route path="/contact-us-2" element={<Contact />} />
          <Route path="/get-the-app" element={<GetApp />} />
          <Route path="/get-the-app/" element={<GetApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
