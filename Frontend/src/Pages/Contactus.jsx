import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        setToastMessage("Please login to submit feedback");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      await axios.post("http://localhost:4000/api/feedback", {
        username: userData._id,
        subject: formData.subject,
        message: formData.message,
      });

      setFormData({ subject: "", message: "" });
      setToastMessage("Feedback submitted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to submit feedback"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="pt-24"></div>
      {showToast && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed top-4 right-4 bg-white  rounded-lg p-4 flex items-center space-x-2 z-50"
        >
          <Check className="text-green-500" size={20} />
          <p className="text-gray-800">{toastMessage}</p>
        </motion.div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white  rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send size={20} />
                  <span>Send Message</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
