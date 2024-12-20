import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  Filter,
  MapPin,
  BedDouble,
  DollarSign,
  SquareDashedBottom,
  Building,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const Filters = ({ props, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    bhk: [],
    price: [],
    sqft: [],
    type: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const categories = {
    location: {
      title: "Location",
      options: [...new Set(props.map((prop) => prop.location))],
    },
    type: {
      title: "Property Type",
      options: [...new Set(props.map((prop) => prop.type))],
    },
    bhk: {
      title: "BHK",
      options: [...new Set(props.map((prop) => `${prop.bhk} BHK`))],
    },
    sqft: {
      title: "Area (sq.ft)",
      options: ["500-1000", "1000-1500", "1500-2000", "2000+"],
    },
    price: {
      title: "Price Range",
      options: ["Under 20L", "20L - 40L", "40L - 60L", "60L - 80L", "80L+"],
    },
  };

  // Add useEffect to handle search term changes
  useEffect(() => {
    onFilterChange({ ...selectedFilters, searchTerm });
  }, [searchTerm]);

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      };

      // Include searchTerm when updating filters
      onFilterChange({ ...updatedFilters, searchTerm });

      return updatedFilters;
    });
  };

  return (
    <div className="p-6 rounded-xl mb-6 bg-white border border-gray-200">
      <h2 className="text-2xl text-center font-['Onest',sans-serif] font-bold text-red-400 mb-3">
        Find Your Perfect Home
      </h2>

      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border border-red-400 rounded-lg focus:outline-none focus:border-red-400"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {Object.entries(categories).map(([key, category], index) => (
          <div
            key={key}
            className={`
              p-6 transition-all duration-300
              ${index === 0 ? "pt-0 md:pt-6" : "pt-6"}
              ${
                index === Object.entries(categories).length - 1
                  ? "pb-0"
                  : "pb-6"
              }
            `}
          >
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              {key === "location" && (
                <MapPin size={18} className="text-red-400" />
              )}
              {key === "bhk" && (
                <BedDouble size={18} className="text-red-400" />
              )}
              {key === "price" && (
                <DollarSign size={18} className="text-red-400" />
              )}
              {key === "sqft" && (
                <SquareDashedBottom size={18} className="text-red-400" />
              )}
              {key === "type" && (
                <Building size={18} className="text-red-400" />
              )}
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.options.map((option, index) => (
                <label
                  key={index}
                  className={`inline-flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md border 
                    cursor-pointer transition-all duration-200 
                    hover:border-red-200 hover:bg-red-50/70
                    ${
                      selectedFilters[key].includes(option)
                        ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters[key].includes(option)}
                    onChange={() => handleFilterChange(key, option)}
                    className="w-3.5 h-3.5 rounded text-red-500 focus:ring-red-400 focus:ring-offset-0"
                  />
                  <span className="whitespace-nowrap text-xs">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
