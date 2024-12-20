import React, { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Navbar from "./Components/Navbar";
import Navroutes from "./Routes/Navroutes";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import Chatbot from "./Components/Chatbot";

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

  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    const lenis = new Lenis({
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Add scroll to top with smooth animation
  const scrollToTop = () => {
    lenis.scrollTo(0, { duration: 1.5 });
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
      </div>
    </HelmetProvider>
  );
};

export default App;
