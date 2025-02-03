import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Video, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const propertyTypeConfig = {
  flats: {
    fields: ['bhk', 'bedroom', 'bathroom', 'kitchen'],
    details: ['lift', 'parking', 'security', 'swimming_pool', 'gym'],
    amenities: ['24/7 Water', 'Power Backup', 'CCTV', 'Fire Safety', 'Club House','Parking','Lifts','Store Room','Pooja Room','Gym']
  },
  houses: {
    fields: ['bhk', 'bedroom', 'bathroom', 'kitchen', 'floors'],
    details: ['parking', 'garden', 'security'],
    amenities: ['24/7 Water', 'Power Backup', 'Rain Water Harvesting', 'Solar Panels','Parking','Lifts','Store Room','Pooja Room','Gym']
  },
  villas: {
    fields: ['bhk', 'bedroom', 'bathroom', 'kitchen', 'garden_area'],
    details: ['swimming_pool', 'parking', 'garden', 'security'],
    amenities: ['24/7 Water', 'Power Backup', 'Club House', 'Garden','Parking','Lifts','Store Room','Pooja Room','Gym']
  },
  shops: {
    fields: ['floors', 'washroom'],
    details: ['parking', 'storage', 'security'],
    amenities: ['24/7 Water', 'Power Backup', 'CCTV', 'Fire Safety']
  },
  'Land': {
    fields: ['acres', 'soil_type', 'water_source'],
    details: ['road_access', 'electricity', 'boundary'],
    amenities: ['Bore Well', 'Canal Water', 'Farm House']
  },
  
  farmhouse: {
    fields: ['acres', 'bhk', 'bedroom', 'bathroom', 'kitchen'],
    details: ['garden', 'farming_area', 'water_source'],
    amenities: ['24/7 Water', 'Power Backup', 'Farm Area', 'Garden']
  }
};

const Sell = ({ refreshProperties }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    type: "flats",
    location: "vijayawada",
    saleOrRent: "sale",
    propertyCategory: "residential",
    price: 10000,
    address: "",
    bhk: "",
    dimensions: {
      length: "",
      width: "",
      unit: "feet"
    },
    carpetArea: {
      value: "",
      unit: "sq.ft"
    },
    builtUpArea: {
      value: "",
      unit: "sq.ft"
    },
    furnishingStatus: "unfurnished",
    flooring: "tiled",
    hasBoundaryWall: false,
    acres: "",
    bedroom: "",
    bathroom: "",
    kitchen: "",
    floors: "",
    washroom: "",
    soil_type: "",
    water_source: "",
    facing: "",
    overview: "",
    details: "",
    locationMap: "",
    amenities: [],
    plotArea: "",
    plotLength: "",
    plotWidth: "",
    plotUnit: "sq.yard",
    plotFacing: "",
    plotBoundaryWall: false,
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    {
      title: "Basic Information",
      description: "Property name, type, and location details"
    },
    {
      title: "Property Details",
      description: "Specific details based on property type"
    },
    {
      title: "Amenities",
      description: "Available facilities and features"
    },
    {
      title: "Media",
      description: "Images and videos of your property"
    },
    {
      title: "Additional Information",
      description: "Overview and other specifications"
    }
  ];

  const formatPrice = (price) => {
    if (price >= 10000000) { // 1 crore or more
      const crores = Math.floor(price / 10000000);
      const remainingLakhs = Math.floor((price % 10000000) / 100000);
      const remainingThousands = Math.floor((price % 100000) / 1000);
      const remaining = price % 1000;
      
      let formattedPrice = '';
      if (crores > 0) formattedPrice += `${crores} Cr `;
      if (remainingLakhs > 0) formattedPrice += `${remainingLakhs} L `;
      if (remainingThousands > 0) formattedPrice += `${remainingThousands}K `;
      if (remaining > 0) formattedPrice += `${remaining}`;
      
      return formattedPrice.trim();
    } else if (price >= 100000) { // lakhs
      const lakhs = Math.floor(price / 100000);
      const remainingThousands = Math.floor((price % 100000) / 1000);
      const remaining = price % 1000;
      
      let formattedPrice = '';
      if (lakhs > 0) formattedPrice += `${lakhs} L `;
      if (remainingThousands > 0) formattedPrice += `${remainingThousands}K `;
      if (remaining > 0) formattedPrice += `${remaining}`;
      
      return formattedPrice.trim();
    } else if (price >= 1000) { // thousands
      const thousands = Math.floor(price / 1000);
      const remaining = price % 1000;
      
      let formattedPrice = '';
      if (thousands > 0) formattedPrice += `${thousands}K `;
      if (remaining > 0) formattedPrice += `${remaining}`;
      
      return formattedPrice.trim();
    }
    return price.toString();
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object updates
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      const validation = validateField(name, value);

      if (validation === true) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      } else {
        showAlert(validation, 'error');
      }
    }
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amenities: value.split(",").map((item) => item.trim()),
    }));
  };

  const uploadInChunks = async (file, resourceType = 'image', chunkSize = 5242880) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'midland_property');
      formData.append('resource_type', resourceType);

      formData.append('chunk_size', chunkSize);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/vishnu2005/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percentCompleted
            }));
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        try {
          if (file.size > 10 * 1024 * 1024) {
            return await uploadInChunks(file, 'image');
          } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'midland_property');

            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/vishnu2005/image/upload`,
              formData,
              {
                onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(prev => ({
                    ...prev,
                    [file.name]: percentCompleted
                  }));
                }
              }
            );
            return response.data.secure_url;
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      showAlert("Images uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading images:", error);
      showAlert("Error uploading images. Please try again.", "error");
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingVideos(true);

    try {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 100 * 1024 * 1024) { // 100MB limit
          throw new Error("Video file size should be less than 100MB");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'midland_property');
        formData.append('resource_type', 'video');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/vishnu2005/video/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: percentCompleted
              }));
            },
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return response.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setVideos(prev => [...prev, ...uploadedUrls]);
      showAlert("Videos uploaded successfully", "success");
    } catch (error) {
      console.error("Error uploading videos:", error);
      showAlert(
        error.message || "Error uploading videos. Please try again.",
        "error"
      );
    } finally {
      setUploadingVideos(false);
      setUploadProgress({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== steps.length) {
      handleNext();
      return;
    }
    setLoading(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?._id) {
        throw new Error("User not authenticated");
      }

      // Get required fields based on property type
      const requiredFields = ['name', 'type', 'location', 'price', 'address', 'saleOrRent'];
      const typeSpecificFields = propertyTypeConfig[formData.type]?.fields || [];
      const allRequiredFields = [...requiredFields, ...typeSpecificFields];

      // Check for missing required fields
      const missingFields = allRequiredFields.filter(field => {
        const value = formData[field];
        return value === undefined || value === "" || value === 0;
      });

      if (missingFields.length > 0) {
        const formattedFields = missingFields.map(field => 
          field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        ).join(', ');
        throw new Error(`Please fill in all required fields: ${formattedFields}`);
      }

      if (images.length === 0) {
        throw new Error("Please upload at least one image");
      }

      // Create property data object with required user info
      const propertyData = {
        ...formData,
        userId: userData._id,  // Add this for seller ID
        sellerId: userData._id, // Add both to ensure compatibility
        sellerName: userData.username || userData.name, // Fallback to name if username doesn't exist
        images,
        videos,
        price: Number(formData.price),
        status: "pending"
      };

      // Convert numeric fields
      ['bhk', 'bedroom', 'bathroom', 'kitchen', 'acres', 'floors', 'washroom'].forEach(field => {
        if (propertyData[field]) {
          propertyData[field] = Number(propertyData[field]);
        }
      });

      

      const response = await axios.post(
        "https://api.midlandrealestateservices.com/api/properties",
        propertyData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization if you're using tokens
            "Authorization": `Bearer ${localStorage.getItem("userInfo")}`
          }
        }
      );

      if (response.data) {
        showAlert("Property listed successfully!", "success");
        await refreshProperties();
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error submitting property";
      showAlert(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'price':
        return value > 0 ? true : 'Price must be greater than 0';
      case 'acres':
        return value > 0 ? true : 'Area must be greater than 0';
      case 'phone':
        return /^\d{10}$/.test(value) ? true : 'Invalid phone number';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid email';
      default:
        return true;
    }
  };

  const renderPropertyFields = () => {
    const fields = propertyTypeConfig[formData.type]?.fields || [];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field}>
            <label className="block mb-2 text-gray-800 font-semibold">
              {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}*
            </label>
            {field === 'soil_type' || field === 'water_source' || field === 'facing' ? (
              <select
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                required
              >
                {getOptionsForField(field).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field === 'acres' ? 'number' : 'text'}
                name={field}
                value={formData[field] || ''}
                onChange={handleInputChange}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                required
                placeholder={getPlaceholderForField(field)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const getOptionsForField = (field) => {
    switch (field) {
      case 'soil_type':
        return ['Black Soil', 'Red Soil', 'Sandy Soil', 'Loamy Soil'];
      case 'water_source':
        return ['Bore Well', 'Canal', 'River', 'Rain Fed'];
      case 'facing':
        return ['North', 'South', 'East', 'West', 'North East', 'North West', 'South East', 'South West'];
      default:
        return [];
    }
  };

  const getPlaceholderForField = (field) => {
    switch (field) {
      case 'acres':
        return 'Enter area in acres';
      case 'dimensions':
        return 'e.g., 30x40';
      default:
        return `Enter ${field.split('_').join(' ')}`;
    }
  };

  const renderPropertyDetails = () => {
    const showBuildingFields = ["flats", "houses", "villas", "shops"].includes(formData.type);

    return (
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-600 border-b-2 border-red-200 pb-2">
          Property Details
        </h2>
        <div className="space-y-6">
          {/* Area Input with Unit Selection */}
          <div className="flex flex-col sm:flex-row sm:space-x-2">
            <div className="flex-1">
              <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                Area*
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <input
                  type="number"
                  name="area.value"
                  value={formData?.area?.value || ""}
                  onChange={handleInputChange}
                  className="w-full sm:w-2/3 p-2 border-2 rounded-lg sm:rounded-l-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  placeholder="Enter area"
                  required
                />
                <select
                  name="area.unit"
                  value={formData?.area?.unit || "sq.yard"}
                  onChange={handleInputChange}
                  className="w-full sm:w-1/3 p-2 border-2 rounded-lg sm:rounded-l-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="sq.yard">Sq. Yard</option>
                  <option value="sq.m">Sq. Meter</option>
                  <option value="acres">Acres</option>
                  <option value="marla">Marla</option>
                  <option value="cents">Cents</option>
                  <option value="bigha">Bigha</option>
                  <option value="kottah">Kottah</option>
                  <option value="kanal">Kanal</option>
                  <option value="grounds">Grounds</option>
                  <option value="ares">Ares</option>
                  <option value="biswa">Biswa</option>
                  <option value="guntha">Guntha</option>
                  <option value="aankadam">Aankadam</option>
                  <option value="hectares">Hectares</option>
                  <option value="rood">Rood</option>
                  <option value="chataks">Chataks</option>
                  <option value="perch">Perch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Building-specific fields */}
          {showBuildingFields && (
            <>
              {/* Dimensions */}
              <div className="w-full">
                <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                  Dimensions (Length x Width)*
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="number"
                      name="dimensions.length"
                      value={formData?.dimensions?.length || ""}
                      onChange={handleInputChange}
                      placeholder="Length"
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                      required
                    />
                    <span className="text-gray-500">×</span>
                    <input
                      type="number"
                      name="dimensions.width"
                      value={formData?.dimensions?.width || ""}
                      onChange={handleInputChange}
                      placeholder="Width"
                      className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                      required
                    />
                  </div>
                  <select
                    name="dimensions.unit"
                    value={formData?.dimensions?.unit || "feet"}
                    onChange={handleInputChange}
                    className="w-full sm:w-1/4 p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  >
                    <option value="feet">Feet</option>
                    <option value="meters">Meters</option>
                  </select>
                </div>
              </div>

              {/* Carpet Area */}
              <div>
                <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                  Carpet Area*
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="number"
                    name="carpetArea.value"
                    value={formData?.carpetArea?.value || ""}
                    onChange={handleInputChange}
                    className="w-full sm:w-2/3 p-2 border-2 rounded-lg sm:rounded-l-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter carpet area"
                    required
                  />
                  <select
                    name="carpetArea.unit"
                    value={formData?.carpetArea?.unit || "sq.ft"}
                    onChange={handleInputChange}
                    className="w-full sm:w-1/3 p-2 border-2 rounded-lg sm:rounded-l-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                    required
                  >
                    <option value="sq.ft">Sq. Ft</option>
                    <option value="sq.yard">Sq. Yard</option>
                    <option value="sq.m">Sq. Meter</option>
                  </select>
                </div>
              </div>

              {/* Built-up Area */}
              <div>
                <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                  Built-up Area*
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="number"
                    name="builtUpArea.value"
                    value={formData?.builtUpArea?.value || ""}
                    onChange={handleInputChange}
                    className="w-full sm:w-2/3 p-2 border-2 rounded-lg sm:rounded-l-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                    placeholder="Enter built-up area"
                    required
                  />
                  <select
                    name="builtUpArea.unit"
                    value={formData?.builtUpArea?.unit || "sq.ft"}
                    onChange={handleInputChange}
                    className="w-full sm:w-1/3 p-2 border-2 rounded-lg sm:rounded-l-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                    required
                  >
                    <option value="sq.ft">Sq. Ft</option>
                    <option value="sq.yard">Sq. Yard</option>
                    <option value="sq.m">Sq. Meter</option>
                  </select>
                </div>
              </div>

              {/* Furnishing Status */}
              <div>
                <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                  Furnishing Status*
                </label>
                <select
                  name="furnishingStatus"
                  value={formData.furnishingStatus}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="furnished">Furnished</option>
                </select>
              </div>

              {/* Flooring */}
              <div>
                <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                  Flooring*
                </label>
                <select
                  name="flooring"
                  value={formData.flooring}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="tiled">Tiled</option>
                  <option value="marbled">Marbled</option>
                </select>
              </div>
            </>
          )}

          {/* Boundary Wall */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Boundary Wall
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hasBoundaryWall"
                  value="true"
                  checked={formData.hasBoundaryWall === true}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'hasBoundaryWall',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="form-radio h-4 w-4 text-red-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="hasBoundaryWall"
                  value="false"
                  checked={formData.hasBoundaryWall === false}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'hasBoundaryWall',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="form-radio h-4 w-4 text-red-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {/* Plot Area */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Plot Area*
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="number"
                name="plotArea"
                value={formData.plotArea}
                onChange={handleInputChange}
                className="w-full sm:w-2/3 p-2 border-2 rounded-lg sm:rounded-l-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                placeholder="Enter plot area"
                required
              />
              <select
                name="plotUnit"
                value={formData.plotUnit}
                onChange={handleInputChange}
                className="w-full sm:w-1/3 p-2 border-2 rounded-lg sm:rounded-l-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              >
                <option value="sq.yard">Sq. Yard</option>
                <option value="sq.m">Sq. Meter</option>
                <option value="acres">Acres</option>
                <option value="marla">Marla</option>
                <option value="cents">Cents</option>
                <option value="bigha">Bigha</option>
                <option value="kottah">Kottah</option>
                <option value="kanal">Kanal</option>
                <option value="grounds">Grounds</option>
                <option value="ares">Ares</option>
                <option value="biswa">Biswa</option>
                <option value="guntha">Guntha</option>
                <option value="aankadam">Aankadam</option>
                <option value="hectares">Hectares</option>
                <option value="rood">Rood</option>
                <option value="chataks">Chataks</option>
                <option value="perch">Perch</option>
              </select>
            </div>
          </div>

          {/* Plot Length */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Plot Length*
            </label>
            <input
              type="number"
              name="plotLength"
              value={formData.plotLength}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              placeholder="Enter plot length"
              required
            />
          </div>

          {/* Plot Width */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Plot Width*
            </label>
            <input
              type="number"
              name="plotWidth"
              value={formData.plotWidth}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              placeholder="Enter plot width"
              required
            />
          </div>

          {/* Plot Facing */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Plot Facing*
            </label>
            <select
              name="plotFacing"
              value={formData.plotFacing}
              onChange={handleInputChange}
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              required
            >
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North East">North East</option>
              <option value="North West">North West</option>
              <option value="South East">South East</option>
              <option value="South West">South West</option>
            </select>
          </div>

          {/* Plot Boundary Wall */}
          <div>
            <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
              Plot Boundary Wall
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="plotBoundaryWall"
                  value="true"
                  checked={formData.plotBoundaryWall === true}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'plotBoundaryWall',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="form-radio h-4 w-4 text-red-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="plotBoundaryWall"
                  value="false"
                  checked={formData.plotBoundaryWall === false}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'plotBoundaryWall',
                      value: e.target.value === 'true'
                    }
                  })}
                  className="form-radio h-4 w-4 text-red-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          {/* Other property fields */}
          {propertyTypeConfig[formData.type]?.fields.map((field) => (
            <div key={field}>
              <label className="block mb-2 text-gray-800 font-semibold text-sm sm:text-base">
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}*
              </label>
              {field === 'soil_type' || field === 'water_source' || field === 'facing' ? (
                <select
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  {getOptionsForField(field).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field === 'acres' ? 'number' : 'text'}
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                  placeholder={getPlaceholderForField(field)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const stepIndicatorVariants = {
    inactive: { scale: 1, backgroundColor: "#D1D5DB" },
    active: { 
      scale: 1.1, 
      backgroundColor: "#EF4444",
      transition: { type: "spring", stiffness: 300 }
    },
    complete: { 
      scale: 1, 
      backgroundColor: "#10B981",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div 
            className="absolute h-1 bg-gray-200 top-1/3 left-0 right-0 -z-10"
            style={{ transform: "translateY(-50%)" }}
          >
            <motion.div 
              className="h-full bg-red-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center relative z-10"
              initial="inactive"
              animate={
                currentStep > index + 1 
                  ? "complete" 
                  : currentStep === index + 1 
                    ? "active" 
                    : "inactive"
              }
            >
              <motion.div 
                variants={stepIndicatorVariants}
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 text-white font-bold shadow-lg"
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </motion.div>
              <div className="text-center">
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 hidden md:block max-w-[120px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Purpose*
                </label>
                <select
                  name="saleOrRent"
                  value={formData.saleOrRent}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price
                </label>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                  <span>₹10K</span>
                  <span className="font-medium">Selected: ₹{formatPrice(formData.price)}</span>
                  <span>₹1 Cr</span>
                </div>
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
                  {Object.keys(propertyTypeConfig).map(type => (
                    <option key={type} value={type}>
                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-800 font-semibold">
                  Property Category*
                </label>
                <select
                  name="propertyCategory"
                  value={formData.propertyCategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                  required
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
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
        );

      case 2:
        return (
          <div>
            {renderPropertyDetails()}
          </div>
        );

      case 3:
        return (
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {propertyTypeConfig[formData.type]?.amenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => {
                      const updatedAmenities = e.target.checked
                        ? [...formData.amenities, amenity]
                        : formData.amenities.filter(a => a !== amenity);
                      setFormData({ ...formData, amenities: updatedAmenities });
                    }}
                    className="form-checkbox h-5 w-5 text-red-500 rounded focus:ring-red-400"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">
              Media Upload
            </h2>
            
            {/* Image Upload Section */}
            <div className="space-y-5 mb-8">
              <h3 className="text-lg font-semibold">Property Images*</h3>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
                accept="image/*"
              />
              <div className="flex gap-4 flex-wrap">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload Section */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">Property Videos (Optional)</h3>
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleVideoUpload}
                      accept="video/*"
                      className="hidden"
                      disabled={uploadingVideos}
                    />
                    <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 cursor-pointer">
                      <div className="text-center">
                        {uploadingVideos ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                            <p className="mt-2 text-sm text-gray-600">
                              Uploading videos... Please wait
                            </p>
                          </div>
                        ) : (
                          <>
                            <Video className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-600">
                              Click to upload videos (Max 100MB each)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supported formats: MP4, WebM, MOV
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Upload Progress */}
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="mt-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Video Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((url, index) => (
                  <div key={index} className="relative">
                    <video
                      src={url}
                      className="w-full rounded-lg"
                      controls
                      preload="metadata"
                    />
                    <button
                      onClick={() => {
                        setVideos(videos.filter((_, i) => i !== index));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      disabled={uploadingVideos}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
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
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 pt-20 pb-10 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-12 text-center text-red-600 font-['Onest',sans-serif]"
        >
          List Your Property
        </motion.h1>

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          <motion.form 
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {renderCurrentStep()}

            <motion.div 
              className="flex justify-between mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2
                  ${currentStep === 1 
                    ? 'invisible' 
                    : 'visible bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold 
                  hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2
                  disabled:from-gray-400 disabled:to-gray-500"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    {currentStep === steps.length ? "List Property" : "Next"}
                    {currentStep !== steps.length && <ChevronRight size={20} />}
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        </AnimatePresence>

        <AnimatePresence>
          {alert.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                alert.type === "error" ? "bg-red-500" : "bg-green-500"
              } text-white flex items-center gap-2`}
            >
              {alert.type === "error" ? "❌" : "✅"}
              {alert.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sell;
