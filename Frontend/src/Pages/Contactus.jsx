import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Check, MapPin, Phone, Mail, Youtube } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="pt-24"></div>
      {showToast && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 right-4 bg-white shadow-xl rounded-lg p-4 flex items-center space-x-2 z-50 border-l-4 border-green-500"
        >
          <Check className="text-green-500" size={20} />
          <p className="text-gray-800 font-medium">{toastMessage}</p>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90"
        >
          <div className="md:grid md:grid-cols-5">
            <div className="bg-gradient-to-br from-red-600 to-red-500 text-white p-12 md:col-span-2">
              <h2 className="text-4xl font-bold mb-8 font-serif">Contact Us</h2>
              <div className="space-y-8">
                <p className="text-white/90 text-lg leading-relaxed">
                  We provide all types of professional real estate services for our costumers. Get your customized solutions at Our office: Lohithya Towers, Nirmala Convent road, Vijayawada 520010.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Office Location</h3>
                      <p className="text-white/90">
                        Lohithya Towers,<br />
                        Nirmala Convent road,<br />
                        Vijayawada 520010
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6" />
                    <p className="text-white/90">admin@midlandrealestateservices.com</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Youtube className="w-6 h-6" />
                    <a 
                      href="https://www.youtube.com/@midlandrealestateinvijayawada"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      Follow us on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 md:col-span-3">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 font-serif">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200 bg-gray-50"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200 bg-gray-50"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Enter your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-8 py-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Send size={20} />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
