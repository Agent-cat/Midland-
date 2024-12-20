import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, UserX, ArrowRight } from "lucide-react";

const LoginRequired = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-6 relative"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lock size={96} className="text-red-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <UserX size={32} className="text-gray-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Login Required
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          Please log in to access this feature. Create an account if you don't
          have one yet.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        ></motion.div>
      </div>
    </div>
  );
};

export default LoginRequired;
