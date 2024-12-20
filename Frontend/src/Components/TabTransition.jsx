import { motion, AnimatePresence } from "framer-motion";

const tabVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const TabTransition = ({ children, activeTab }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabTransition; 