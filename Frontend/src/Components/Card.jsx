import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble, ChefHat, Maximize, BadgeCheck, Trees, Droplets, Compass } from "lucide-react";

const Card = ({ props }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${props._id}`, { state: { propertyData: props } });
  };

  const { name, price, saleOrRent, images, address, type } = props;

  const renderPropertyDetails = () => {
    switch (type) {
      case 'flats':
      case 'houses':
      case 'villas':
        return (
          <div className="flex items-center text-gray-600">
            {props.bedroom && (
              <>
                <BedDouble size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.bedroom} Bedroom</p>
              </>
            )}
            {props.kitchen && (
              <>
                <ChefHat size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.kitchen} Kitchen</p>
              </>
            )}
            {props.sqft && (
              <>
                <Maximize size={18} className="mr-1" />
                <p className="text-sm">{props.sqft} sq.ft</p>
              </>
            )}
          </div>
        );

      case 'shops':
        return (
          <div className="flex items-center text-gray-600">
            {props.sqft && (
              <>
                <Maximize size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.sqft} sq.ft</p>
              </>
            )}
            {props.floors && (
              <p className="text-sm">{props.floors} Floor(s)</p>
            )}
          </div>
        );

      case 'agriculture land':
        return (
          <div className="flex items-center text-gray-600">
            {props.acres && (
              <>
                <Trees size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.acres} Acres</p>
              </>
            )}
            {props.water_source && (
              <>
                <Droplets size={18} className="mr-1" />
                <p className="text-sm">{props.water_source}</p>
              </>
            )}
          </div>
        );

      case 'residential land':
        return (
          <div className="flex items-center text-gray-600">
            {props.sqft && (
              <>
                <Maximize size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.sqft} sq.ft</p>
              </>
            )}
            {props.facing && (
              <>
                <Compass size={18} className="mr-1" />
                <p className="text-sm">{props.facing} Facing</p>
              </>
            )}
          </div>
        );

      case 'farmhouse':
        return (
          <div className="flex items-center text-gray-600">
            {props.acres && (
              <>
                <Trees size={18} className="mr-1" />
                <p className="text-sm mr-3">{props.acres} Acres</p>
              </>
            )}
            {props.bedroom && (
              <>
                <BedDouble size={18} className="mr-1" />
                <p className="text-sm">{props.bedroom} Bedroom</p>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden transition-transform duration-300 md:hover:scale-105 max-w-md mx-auto cursor-pointer"
      onClick={handleCardClick}
    >
      <img src={images[0]} alt={name} className="w-full h-48 object-cover" />
      {props.isVerified && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm shadow-md">
          <BadgeCheck size={16} />
          <span className="text-xs font-medium">Verified</span>
        </div>
      )}
      <p className="absolute top-2 left-2 bg-red-400 text-white px-2 font-bold py-1 rounded-md text-sm">
        {saleOrRent.toUpperCase()}
      </p>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-xl mb-2">{name}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={18} className="mr-2" />
          <p className="text-sm">{address}</p>
        </div>
        <p className="text-2xl text-red-400 font-bold mb-3">
          ₹{price.toLocaleString()}
          {saleOrRent === "rent" ? "/month" : ""}
        </p>
        <div className="flex justify-between mt-3">
          {renderPropertyDetails()}
        </div>
      </div>
    </div>
  );
};

export default Card;
