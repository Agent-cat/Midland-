import React, { useState, useEffect, useRef } from "react";

import Card from "./Card";
import Filters from "./Filters";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LoaderCircle, ChevronLeft, ChevronRight } from "lucide-react";

const CardLayout = ({ initialProperties }) => {
  const [filteredProperties, setFilteredProperties] =
    useState(initialProperties);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 8;
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const cardRefs = useRef([]);

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

    if (filters.location && filters.location.length > 0) {
      result = result.filter((property) =>
        filters.location.includes(property.location)
      );
    }

    if (filters.bhk && filters.bhk.length > 0) {
      const bhks = filters.bhk.map((bhk) => parseInt(bhk.split(" ")[0]));
      result = result.filter((property) => bhks.includes(property.bhk));
    }

    if (filters.price && filters.price.length > 0) {
      result = result.filter((property) => {
        return filters.price.some((range) => {
          const price = property.price;
          if (range === "Under 20L") return price < 2000000;
          if (range === "20L - 40L")
            return price >= 2000000 && price <= 4000000;
          if (range === "40L - 60L")
            return price >= 4000000 && price <= 6000000;
          if (range === "60L - 80L")
            return price >= 6000000 && price <= 8000000;
          if (range === "80L+") return price >= 8000000;
          return true;
        });
      });
    }

    if (filters.sqft && filters.sqft.length > 0) {
      result = result.filter((property) => {
        const propertySqft = parseInt(property.sqft);
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
        filters.type.includes(property.type)
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

  return (
    <>
      <div className="filter-container">
        <Filters props={initialProperties} onFilterChange={applyFilters} />
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
