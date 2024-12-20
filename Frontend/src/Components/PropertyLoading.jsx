import { motion } from "framer-motion";

const PropertyLoading = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4"
      >
        {/* Shimmer loading cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              {/* Image placeholder */}
              <div className="w-full h-64 bg-gray-200 animate-pulse" />
              
              {/* Content placeholders */}
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyLoading; 