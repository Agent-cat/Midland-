import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sell = ({ refreshProperties }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    type: "flats",
    sqft: "",
    location: "vijayawada",
    bhk: "",
    address: "",
    ownerName: "",
    saleOrRent: "sale",
    price: "",
    details: "",
    dimensions: "",
    overview: "",
    amenities: [],
    locationMap: "",
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
  });
  const [images, setImages] = useState([]);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amenities: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "midland_property");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/vishnu2005/image/upload`,
          formData
        );
        return response.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        throw new Error("User data not found");
      }

      const propertyData = {
        ...formData,
        images,
        userId: userData._id,
        sellerName: userData.username || formData.ownerName,
        status: "available"
      };

      const response = await axios.post(
        "http://localhost:4000/api/properties",
        propertyData
      );

      if (response.data) {
        showAlert("Property listed successfully!", "success");
        refreshProperties();
        navigate("/buy");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      if (error.response?.status === 409) {
        showAlert("This property already exists", "error");
      } else {
        showAlert(error.response?.data?.message || "Error listing property", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-24 p-8  rounded-xl shadow-lg">
      {alert.show && (
        <div
          className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            alert.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {alert.message}
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-12 text-center text-red-600 font-['Onest',sans-serif] animate-fade-in">
        List Your Property
      </h1>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Property Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Property Type*
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="flats">Flats</option>
                  <option value="houses">Houses</option>
                  <option value="villas">Villas</option>
                  <option value="shops">Shops</option>
                  <option value="agriculture land">Agriculture Land</option>
                  <option value="residential land">Residential Land</option>
                  <option value="farmhouse">Farmhouse</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Square Feet*
                </label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Location*
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="vijayawada">Vijayawada</option>
                  <option value="amravathi">Amravathi</option>
                  <option value="guntur">Guntur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Property Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  BHK*
                </label>
                <input
                  type="number"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Owner Name*
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Listing Type*
                </label>
                <select
                  name="saleOrRent"
                  value={formData.saleOrRent}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Price*
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Room Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedroom"
                  value={formData.bedroom}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathroom"
                  value={formData.bathroom}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Kitchens
                </label>
                <input
                  type="number"
                  name="kitchen"
                  value={formData.kitchen}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Additional Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Full Address*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  rows="2"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Property Details
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 space-y-5">
          <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
            Property Specifications
          </h2>

          <div>
            <label className="block mb-2 text-gray-800 font-semibold">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              placeholder="e.g., 30x40"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-800 font-semibold">
              Overview
            </label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-800 font-semibold">
              Amenities (comma-separated)
            </label>
            <textarea
              name="amenities"
              value={formData.amenities.join(", ")}
              onChange={handleAmenitiesChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              rows="2"
              placeholder="e.g., Swimming Pool, Gym, Garden"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-800 font-semibold">
              Location Map Link
            </label>
            <input
              type="text"
              name="locationMap"
              value={formData.locationMap}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              placeholder="Google Maps URL"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
            Property Images
          </h2>
          <div className="space-y-5">
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              accept="image/*"
            />

            <div className="flex gap-4 flex-wrap">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          {loading ? "Submitting..." : "List Property"}
        </button>
      </form>
    </div>
  );
};

export default Sell;
