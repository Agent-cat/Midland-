import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-24 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
    >
      {icons[type]}
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:bg-white/20 rounded-full p-1"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
