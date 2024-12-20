import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
    >
      <motion.div
        animate={{
          rotate: 360,
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
      />
    </motion.div>
  );
};

export default LoadingSpinner; 