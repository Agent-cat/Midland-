import React from "react";
import CardLayout from "../Components/CardLayout";

const Rent = ({ properties, loading }) => {
  const rentProperties = properties.filter(
    (property) => property.saleOrRent === "rent"
  );

  return (
    <div className="mt-20">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <CardLayout initialProperties={rentProperties} />
      )}
    </div>
  );
};

export default Rent;
