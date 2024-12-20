import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Check } from "lucide-react";
const Pricing = ({ loggedIn }) => {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (!loggedIn) {
      navigate("/loginrequired");
      return;
    }
    console.log(`Subscribing to ${plan} plan`);
  };

  const plans = [
    {
      name: "Free",
      price: "0",
      duration: "month",
      features: [
        "View property images",
        "Basic property details",
        "Contact agents",
        "Save properties",
      ],
    },
    {
      name: "Pro",
      price: "999",
      duration: "month",
      features: [
        "All Free features",
        "View property overview",
        "View amenities",
        "Priority support",
        "Detailed analytics",
        "Virtual tours",
        "Custom branding",
        "API access",
        "Advanced analytics",
        "Unlimited listings",
      ],
    },
  ];

  return (
    <div className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600">
          Get access to exclusive property details and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <Shield className="text-red-500" size={20} />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">₹{plan.price}</span>
              <span className="text-gray-600">/{plan.duration}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="text-green-500 mr-2" size={16} />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.name)}
              className="w-full py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 text-sm"
            >
              {plan.price === "0" ? "Get Started" : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
