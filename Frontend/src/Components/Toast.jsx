import React from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Toast = ({ message, type }) => {
  useGSAP(() => {
    gsap.fromTo(
      ".toast-animation",
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.5 }
    );
  }, []);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${bgColor} text-white toast-animation max-w-md`}
    >
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
};

export default Toast;
