import React, { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Navbar from "./Components/Navbar";
import Navroutes from "./Routes/Navroutes";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import Chatbot from "./Components/Chatbot";
import ScrollToTop from "./Components/ScrollToTop";

const App = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : null;
  });
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!localStorage.getItem("userInfo");
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [lenis, setLenis] = useState(null);

  const fetchProperties = async () => {
    try {
      const response = await axios.get("https://api.midlandrealestateservices.com/api/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(lenisInstance);

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) return;

      try {
        const response = await axios.get(
          `https://api.midlandrealestateservices.com/api/properties/cart/${userData._id}`
        );
        setCartCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    }
  };

  return (
    <HelmetProvider>
      <div className="select-none font-['Onest',sans-serif]">
        <Navbar
          data={data}
          setData={setData}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />
        <Navroutes
          data={data}
          setData={setData}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          properties={properties}
          loading={loading}
          refreshProperties={fetchProperties}
        />
        <Chatbot />
        <ScrollToTop />
      </div>
    </HelmetProvider>
  );
};

export default App;
