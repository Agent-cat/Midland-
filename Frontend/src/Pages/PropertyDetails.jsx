import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Image,
  Map,
  X,
  Bed,
  Bath,
  Home,
  ChefHat,
  Maximize,
  ShoppingCart,
  Check,
  BadgeCheck,
  Video,
  Building2,
  Trees,
  Layers,
  Droplets,
  Ruler,
  Compass,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import LoginRequired from "../Components/LoginRequired";
import { motion, AnimatePresence } from "framer-motion";
import PropertyLoading from "../Components/PropertyLoading";

const PropertyDetails = ({ properties, loggedIn }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPhotos, setShowPhotos] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showVideos, setShowVideos] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const loadPropertyData = async () => {
      if (location.state && location.state.propertyData) {
        setPropertyData(location.state.propertyData);
      } else {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/properties/${id}`
          );
          setPropertyData(response.data);
        } catch (error) {
          console.error("Error fetching property:", error);
          navigate("/buy");
        }
      }
    };

    loadPropertyData();
  }, [id, location.state, navigate]);

  useEffect(() => {
    const checkCartStatus = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/api/properties/cart/${userData._id}`
        );
        setIsInCart(
          response.data.some((item) => item._id === propertyData._id)
        );
      } catch (error) {
        console.error("Error checking cart status:", error);
      }
    };

    if (propertyData) {
      checkCartStatus();
    }
  }, [propertyData]);

  useEffect(() => {
    if (propertyData && loggedIn) {
      setShowPhoneModal(true);
    }
  }, [propertyData, loggedIn]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) return;

      await axios.post(
        `http://localhost:4000/api/properties/${propertyData._id}/views`,
        {
          userId: userData._id,
          phone: userPhone
        }
      );
      
      setShowPhoneModal(false);
      setPhoneError("");
    } catch (error) {
      console.error("Error submitting phone number:", error);
      setPhoneError("Failed to verify phone number. Please try again.");
    }
  };

  const handleCloseModal = () => {
    navigate(-1);
  };

  if (!loggedIn) {
    return <LoginRequired />;
  }

  if (!propertyData) {
    return <PropertyLoading />;
  }

  const {
    name = "",
    location: propertyLocation = "",
    price = 0,
    saleOrRent = "",
    images = [],
    address = "",
    ownerName = "",
    bhk = 0,
    sqft = 0,
    overview = "",
    amenities = [],
    details = "",
    locationMap = "",
    kitchen = 0,
    bathroom = 0,
  } = propertyData || {};

  const formattedPrice =
    typeof price === "number" ? price.toLocaleString() : "0";

  const handleNextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <p className="text-gray-600">{overview}</p>;
      case "amenities":
        return (
          <div className="grid grid-cols-2 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        );
      case "details":
        return <p className="text-gray-600">{details}</p>;
      default:
        return null;
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:4000/api/properties/cart/add", {
        userId: userData._id,
        propertyId: propertyData._id,
      });
      setIsInCart(true);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
      setLoading(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:4000/api/contacts", {
        propertyId: propertyData._id,
        userId: userData._id,
        ...contactForm,
      });
      setShowContactForm(false);
      setContactForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Contact request sent successfully!");
    } catch (error) {
      console.error("Error sending contact request:", error);
      toast.error("Failed to send contact request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: name,
    description: overview,
    price: price,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4
      }
    }
  };

  const imageVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    }
  };

  const handleViewChange = (view) => {
    setShowPhotos(view === 'photos');
    setShowVideos(view === 'videos');
    setShowMap(view === 'map');
  };

  const renderPropertyDetails = () => {
    switch (propertyData.type) {
      case 'flats':
      case 'houses':
      case 'villas':
        return (
          <div className="flex flex-wrap gap-6">
            {propertyData.bhk && (
              <div className="flex items-center">
                <Home className="mr-2 text-red-600" />
                <span>{propertyData.bhk} BHK</span>
              </div>
            )}
            {propertyData.bedroom && (
              <div className="flex items-center">
                <Bed className="mr-2 text-red-600" />
                <span>{propertyData.bedroom} Bedrooms</span>
              </div>
            )}
            {propertyData.bathroom && (
              <div className="flex items-center">
                <Bath className="mr-2 text-red-600" />
                <span>{propertyData.bathroom} Bathrooms</span>
              </div>
            )}
            {propertyData.kitchen && (
              <div className="flex items-center">
                <ChefHat className="mr-2 text-red-600" />
                <span>{propertyData.kitchen} Kitchen</span>
              </div>
            )}
            {propertyData.sqft && (
              <div className="flex items-center">
                <Maximize className="mr-2 text-red-600" />
                <span>{propertyData.sqft} sq.ft</span>
              </div>
            )}
          </div>
        );

      case 'shops':
        return (
          <div className="flex flex-wrap gap-6">
            {propertyData.sqft && (
              <div className="flex items-center">
                <Maximize className="mr-2 text-red-600" />
                <span>{propertyData.sqft} sq.ft</span>
              </div>
            )}
            {propertyData.floors && (
              <div className="flex items-center">
                <Building2 className="mr-2 text-red-600" />
                <span>{propertyData.floors} Floor(s)</span>
              </div>
            )}
            {propertyData.washroom && (
              <div className="flex items-center">
                <Bath className="mr-2 text-red-600" />
                <span>{propertyData.washroom} Washroom(s)</span>
              </div>
            )}
          </div>
        );

      case 'agriculture land':
        return (
          <div className="flex flex-wrap gap-6">
            {propertyData.acres && (
              <div className="flex items-center">
                <Trees className="mr-2 text-red-600" />
                <span>{propertyData.acres} Acres</span>
              </div>
            )}
            {propertyData.soil_type && (
              <div className="flex items-center">
                <Layers className="mr-2 text-red-600" />
                <span>Soil: {propertyData.soil_type}</span>
              </div>
            )}
            {propertyData.water_source && (
              <div className="flex items-center">
                <Droplets className="mr-2 text-red-600" />
                <span>Water: {propertyData.water_source}</span>
              </div>
            )}
          </div>
        );

      case 'residential land':
        return (
          <div className="flex flex-wrap gap-6">
            {propertyData.sqft && (
              <div className="flex items-center">
                <Maximize className="mr-2 text-red-600" />
                <span>{propertyData.sqft} sq.ft</span>
              </div>
            )}
            {propertyData.dimensions && (
              <div className="flex items-center">
                <Ruler className="mr-2 text-red-600" />
                <span>Size: {propertyData.dimensions}</span>
              </div>
            )}
            {propertyData.facing && (
              <div className="flex items-center">
                <Compass className="mr-2 text-red-600" />
                <span>Facing: {propertyData.facing}</span>
              </div>
            )}
          </div>
        );

      case 'farmhouse':
        return (
          <div className="flex flex-wrap gap-6">
            {propertyData.acres && (
              <div className="flex items-center">
                <Trees className="mr-2 text-red-600" />
                <span>{propertyData.acres} Acres</span>
              </div>
            )}
            {propertyData.bedroom && (
              <div className="flex items-center">
                <Bed className="mr-2 text-red-600" />
                <span>{propertyData.bedroom} Bedrooms</span>
              </div>
            )}
            {propertyData.bathroom && (
              <div className="flex items-center">
                <Bath className="mr-2 text-red-600" />
                <span>{propertyData.bathroom} Bathrooms</span>
              </div>
            )}
            {propertyData.kitchen && (
              <div className="flex items-center">
                <ChefHat className="mr-2 text-red-600" />
                <span>{propertyData.kitchen} Kitchen</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{name} | Midland Real Estate</title>
        <meta
          name="description"
          content={`${bhk} BHK ${saleOrRent} for ${price.toLocaleString()} in ${address}. ${overview}`}
        />
        <meta
          name="keywords"
          content={`${bhk} BHK, ${saleOrRent}, ${price.toLocaleString()}, ${address}, ${overview}`}
        />
        <meta property="og:title" content={`${name} | Midland Real Estate`} />
        <meta
          property="og:description"
          content={`${bhk} BHK ${saleOrRent} for ${price.toLocaleString()} in ${address}`}
        />
        <meta property="og:image" content={images[0]} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container mx-auto px-4 py-8"
      >
        {showAddedToCart && (
          <div className="fixed top-24 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
            Added to cart successfully!
          </div>
        )}
        <div className="w-full overflow-y-auto mt-20 h-full p-4 rounded-2xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-1 flex items-center text-red-600 hover:underline"
          >
            <ChevronLeft className="mr-2" />
            <div className="px-2 py-1 rounded-md bg-red-600 text-white">
              Back
            </div>
          </button>
          <div className="rounded-lg p-3">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                className={`flex items-center px-4 py-2 rounded-full ${
                  showPhotos ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleViewChange('photos')}
              >
                <Image className="mr-2" /> Photos
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-full ${
                  showVideos ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleViewChange('videos')}
              >
                <Video className="mr-2" /> Videos
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-full ${
                  showMap ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleViewChange('map')}
              >
                <Map className="mr-2" /> Map
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative mb-6 rounded-xl w-full h-[400px] md:h-[calc(100vh-300px)]">
                  {showPhotos && (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={images[currentImageIndex]}
                          variants={imageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            opacity: { duration: 0.5, ease: "easeInOut" }
                          }}
                          className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                          onClick={toggleFullScreen}
                        />
                      </AnimatePresence>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
                      >
                        <ChevronLeft />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
                      >
                        <ChevronRight />
                      </button>
                    </>
                  )}
                  {showMap && (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3896.4200262163104!2d80.62001967522313!3d16.441925684292904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a7d81943%3A0x8ba5d78f65df94b8!2sK%20L%20E%20F%20Deemed%20To%20Be%20University!5e1!3m2!1sen!2sin!4v1729451108838!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="eager"
                      className="rounded-xl h-[400px] md:h-[calc(100vh-240px)]"
                    ></iframe>
                  )}
                  {showVideos && propertyData.videos && propertyData.videos.length > 0 && (
                    <video
                      src={propertyData.videos[0]}
                      className="w-full h-full object-cover rounded-xl"
                      controls
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                {showPhotos && (
                  <div className="flex space-x-4 mb-6 ">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${name} - Image ${index + 1}`}
                        className={`w-24 h-24 object-cover rounded-xl cursor-pointer transition-all duration-300 ${
                          index === currentImageIndex
                            ? "border-2 border-red-500 scale-105"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-0 text-gray-800">
                      {name}
                    </h2>
                    {propertyData?.isVerified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-full text-sm">
                        <BadgeCheck size={16} />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl md:text-3xl text-red-600 font-bold">
                    ₹{formattedPrice}
                    {saleOrRent === "rent" ? "/month" : ""}
                  </p>
                </div>
                <p className="text-gray-600 flex items-center mb-6">
                  <MapPin className="mr-2" /> {address}
                </p>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Property Details:
                  </h3>
                  {renderPropertyDetails()}
                </div>
                <div>
                  <div className="flex space-x-6 mb-4 border-b border-gray-200">
                    {["overview", "details", "amenities"].map((tab) => (
                      <div key={tab} className="relative">
                        <span
                          className={`text-lg font-medium cursor-pointer pb-2 ${
                            activeTab === tab
                              ? "text-red-600 border-b-2 border-red-600"
                              : "text-gray-600 hover:text-red-500"
                          }`}
                          onClick={() => handleTabChange(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-[200px] overflow-y-auto transition-all duration-300 ease-in-out mb-6">
                    {renderTabContent()}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-colors duration-300"
                    >
                      Contact Agent
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={loading || isInCart}
                      className={`px-8 py-3 flex items-center justify-center gap-2 rounded-full transition-colors duration-300 ${
                        isInCart
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      <ShoppingCart size={20} />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isFullScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={toggleFullScreen}
          >
            <div
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl"
              />
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300"
              >
                <ChevronRight />
              </button>
              <button
                onClick={toggleFullScreen}
                className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Contact Agent</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 h-32"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={20} className="text-gray-600" />
              </button>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Enter Your Phone Number
                </h3>
                <p className="text-gray-600 mt-2">
                  Please provide your phone number to view property details
                </p>
              </div>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => {
                      setUserPhone(e.target.value);
                      setPhoneError("");
                    }}
                    placeholder="Enter 10-digit phone number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                    required
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Continue to Property Details
                </button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default PropertyDetails;
