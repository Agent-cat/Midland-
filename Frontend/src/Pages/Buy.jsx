import React from "react";
import CardLayout from "../Components/CardLayout";
import PropertyLoading from "../Components/PropertyLoading";

const Buy = ({ properties, loading }) => {
  const buyProperties = properties.filter(
    (property) => property.saleOrRent === "sale"
  );

  return (
    <div className="mt-20">
      {loading ? <PropertyLoading /> : <CardLayout initialProperties={buyProperties} />}
    </div>
  );
};

export default Buy;
