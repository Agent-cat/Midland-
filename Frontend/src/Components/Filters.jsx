import React, { useState, useEffect } from "react";
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

const Filters = ({ props, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    bhk: [],
    price: 50,
    sqft: [],
    type: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const categories = {
    location: {
      title: "Location",
      options: [...new Set(props.map((prop) => prop.location))].filter(Boolean).sort(),
    },
    type: {
      title: "Property Type",
      options: [...new Set(props.map((prop) => prop.type?.toLowerCase()))].filter(Boolean).sort(),
    },
    bhk: {
      title: "BHK",
      options: [...new Set(props.map((prop) => prop.bhk ? `${prop.bhk} BHK` : null))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b)),
    },
    sqft: {
      title: "Area (sq.ft)",
      options: ["0-500", "500-1000", "1000-1500", "1500-2000", "2000+"],
    },
    price: {
      title: "Price Range (Lakhs)",
      isSlider: true,
      min: 0,
      max: Math.max(100, ...props.map(prop => Math.ceil(prop.price / 100000))),
      step: 5
    },
  };

  const handleFilterChange = (category, value) => {
    if (category === 'price') {
      const priceValue = parseInt(value);
      setSelectedFilters(prev => ({
        ...prev,
        price: priceValue
      }));
    } else {
      setSelectedFilters((prev) => {
        const updatedFilters = {
          ...prev,
          [category]: prev[category].includes(value)
            ? prev[category].filter((item) => item !== value)
            : [...prev[category], value],
        };
        return updatedFilters;
      });
    }
  };

  const formatPrice = (value) => {
    return `${value}L`;
  };

  const getPriceRange = (price) => {
    const maxPrice = categories.price.max;
    const percentage = price / 100;
    return {
      min: Math.max(0, Math.floor(maxPrice * percentage - 10)),
      max: Math.ceil(maxPrice * percentage + 10)
    };
  };

  useEffect(() => {
    const range = getPriceRange(selectedFilters.price);
    onFilterChange({ 
      ...selectedFilters, 
      searchTerm,
      priceRange: range
    });
  }, [searchTerm, selectedFilters]);

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
              {category.isSlider ? (
                <div className="w-full px-2">
                  <input
                    type="range"
                    value={selectedFilters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    min={category.min}
                    max={category.max}
                    step={category.step}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400"
                  />
                  <div className="flex justify-center mt-2 text-sm text-gray-600">
                    <span>Price Range: {formatPrice(getPriceRange(selectedFilters.price).min)} - {formatPrice(getPriceRange(selectedFilters.price).max)}</span>
                  </div>
                </div>
              ) : (
                category.options.map((option, index) => (
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
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
