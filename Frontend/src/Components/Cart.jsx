import React, { useRef, useEffect, useState } from "react";
import { X, ShoppingCart } from "lucide-react";
import { gsap } from "gsap";
import axios from "axios";

const Cart = ({ isOpen, onClose }) => {
  const cartRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartRef.current) {
      if (isOpen) {
        gsap.to(cartRef.current, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(cartRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) return;

      const response = await axios.get(
        `http://localhost:4000/api/properties/cart/${userData._id}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (propertyId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      await axios.post("http://localhost:4000/api/properties/cart/remove", {
        userId: userData._id,
        propertyId,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div
        ref={cartRef}
        className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl transform translate-x-full"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={48} className="mb-4" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.location}</p>
                    <p className="text-red-500 font-bold">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
