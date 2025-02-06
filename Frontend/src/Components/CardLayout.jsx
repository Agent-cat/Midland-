import React, { useState, useEffect, useRef } from "react";

import Card from "./Card";
import Filters from "./Filters";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LoaderCircle, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

const CardLayout = ({ initialProperties }) => {
  const [filteredProperties, setFilteredProperties] =
    useState(initialProperties);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const cardRefs = useRef([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    setFilteredProperties(initialProperties);
  }, [initialProperties]);

  useEffect(() => {
    initialProperties.forEach((property) => {
      property.images.forEach((imageUrl) => {
        const img = new Image();
        img.src = imageUrl;
      });
    });
  }, [initialProperties]);

  const applyFilters = (filters) => {
    if (!filters) return;

    setIsFiltering(true);
    setCurrentPage(1);
    let result = initialProperties;

    if (showVerifiedOnly) {
      result = result.filter(property => property.isVerified);
    }

    if (filters.location && filters.location.length > 0) {
      result = result.filter((property) =>
        filters.location.includes(property.location)
      );
    }

    if (filters.bhk && filters.bhk.length > 0) {
      const bhks = filters.bhk.map((bhk) => parseInt(bhk.split(" ")[0]));
      result = result.filter((property) => 
        property.bhk && bhks.includes(parseInt(property.bhk))
      );
    }

    if (filters.price && filters.priceRange) {
      result = result.filter((property) => {
        const propertyPriceInLakhs = property.price / 100000;
        return propertyPriceInLakhs >= filters.priceRange.min && 
               propertyPriceInLakhs <= filters.priceRange.max;
      });
    }

    if (filters.sqft && filters.sqft.length > 0) {
      result = result.filter((property) => {
        // Get the area value from either carpetArea or builtUpArea
        const propertySqft = property.carpetArea?.value || property.builtUpArea?.value || 0;
        return filters.sqft.some((range) => {
          const [min, max] = range
            .split("-")
            .map((num) => (num === "+" ? Infinity : parseInt(num)));
          return propertySqft >= min && propertySqft <= (max || Infinity);
        });
      });
    }

    if (filters.type && filters.type.length > 0) {
      result = result.filter((property) =>
        filters.type.includes(property.type.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter((property) =>
        Object.values(property).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setFilteredProperties(result);
        setIsFiltering(false);
      },
    });
  };

  useEffect(() => {
    applyFilters({});
  }, [showVerifiedOnly]);

  useGSAP(() => {
    if (!isFiltering) {
      gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out",
            }
          );
        }
      });
    } else {
      gsap.to(loaderRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "linear",
      });
    }
  }, [isFiltering, filteredProperties]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filteredProperties.length);
  }, [filteredProperties]);

  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, []);

  return (
    <>
      <div className="filter-container">
        
        <Filters props={initialProperties} onFilterChange={applyFilters} />
        <div className="flex justify-start mb-4 px-4">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={showVerifiedOnly}
                onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-300 group-hover:bg-gray-300"></div>
              <div
                className={`absolute w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out top-1 left-1
                  ${showVerifiedOnly 
                    ? 'transform translate-x-4 bg-green-500' 
                    : 'transform translate-x-0 bg-white'
                  }`}
              ></div>
            </div>
            <div className="flex items-center gap-1 ml-3 text-gray-700 font-medium">
              <BadgeCheck 
                size={20} 
                className={`transition-colors duration-300 ${
                  showVerifiedOnly ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm">Verified Properties Only</span>
            </div>
          </label>
        </div>
      </div>
      {!isFiltering && (
        <>
          <div
            ref={containerRef}
            className="grid grid-cols-1 cursor-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
          >
            {currentProperties.map((property, index) => (
              <div
                key={`${property.id}-${index}`}
                className="card-item w-full"
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <Card props={property} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 my-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === index + 1
                      ? "bg-red-500 text-white"
                      : "text-gray-600 hover:bg-red-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}
      {isFiltering && (
        <div className="flex justify-center items-center h-64">
          <div ref={loaderRef} className="text-red-500">
            <LoaderCircle size={50} />
          </div>
        </div>
      )}
    </>
  );
};

export default CardLayout;
