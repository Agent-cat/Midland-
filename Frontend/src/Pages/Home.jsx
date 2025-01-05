import React, { useState, useEffect } from "react";
import video from "../assets/video1.mp4";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Card from "../Components/Card";
import { motion } from "framer-motion";
import img1 from "../assets/midland2.png"
import PropertyLoading from "../Components/PropertyLoading";

const Home = ({ cartCount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingProperties, setTrendingProperties] = useState([]);

  useEffect(() => {
    const fetchTrendingProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/properties"
        );
        setTrendingProperties(response.data.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      }
    };

    fetchTrendingProperties();
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <PropertyLoading />
      ) : (
        <>
          <div className="fixed bottom-4 right-4 md:hidden z-50">
            <Link
              to="/cart"
              className="bg-red-500 p-3 rounded-full shadow-lg flex items-center justify-center relative"
            >
              <ShoppingCart className="text-white" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          <div className="relative h-[100vh] w-full overflow-hidden">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover scale-105 transform"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <motion.img
                src={img1} 
                alt="Midland Logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-36 scale-[2.5] lg:scale-150 md:h-30  md:pt-7 lg:pt-0 lg:h-80 mb-8"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl md:text-2xl mb-12 max-w-3xl font-light tracking-wide leading-relaxed"
              >
                Luxury living redefined. Find your perfect home with us.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  to="/buy"
                  className="group bg-red-500 hover:bg-red-600 text-white px-12 py-4 rounded-full text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
                >
                  Explore Properties
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-gray-50 to-white py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent font-serif"
                >
                  Featured Properties
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                  Experience our most distinguished properties, handpicked for the
                  discerning buyer
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingProperties.map((property) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <Card props={property} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
