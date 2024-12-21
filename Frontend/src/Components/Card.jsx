import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, BedDouble, ChefHat, Maximize, BadgeCheck } from "lucide-react";

const Card = ({ props }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${props._id}`, { state: { propertyData: props } });
  };

  const { name, price, saleOrRent, images, address, bedroom, kitchen, sqft } =
    props;

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
          <div className="flex items-center text-gray-600">
            <BedDouble size={18} className="mr-1" />
            <p className="text-sm mr-3">{bedroom} Bedroom</p>
            <ChefHat size={18} className="mr-1" />
            <p className="text-sm mr-3">{kitchen} Kitchen</p>
            <Maximize size={18} className="mr-1" />
            <p className="text-sm">{sqft} sq.ft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
