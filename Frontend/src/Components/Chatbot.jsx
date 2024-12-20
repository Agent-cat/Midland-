import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm Midland Assistant. How can I help you today?",
      options: [
        "Buy Property",
        "Rent Property",
        "Services",
        "Property Types",
        "FAQ",
        "Contact",
      ],
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { type: "user", content: option }]);

    let botResponse = {
      type: "bot",
      content: "",
      options: [],
    };

    switch (option) {
      case "Buy Property":
        botResponse.content = "Redirecting you to our properties for sale...";
        botResponse.options = ["Back to Menu"];
        setTimeout(() => {
          navigate("/buy");
        }, 1000);
        break;

      case "Rent Property":
        botResponse.content = "Redirecting you to our rental properties...";
        botResponse.options = ["Back to Menu"];
        setTimeout(() => {
          navigate("/rent");
        }, 1000);
        break;

      case "Property Types":
        botResponse.content =
          "We handle various types of properties including:\n• Flats\n• Houses\n• Villas\n• Shops\n• Agricultural Land\n• Residential Land\n• Farmhouse";
        botResponse.options = [
          "Buy Property",
          "Rent Property",
          "View by Location",
          "Back to Menu",
        ];
        break;

      case "View by Location":
        botResponse.content =
          "We have properties in these locations:\n• Vijayawada\n• Guntur\n• Amaravathi\n\nWhere would you like to explore?";
        botResponse.options = ["Buy Property", "Rent Property", "Back to Menu"];
        break;

      case "Services":
        botResponse.content =
          "Midland Real Estate offers comprehensive services including buying, selling, and renting properties. We've been serving customers for over three decades.";
        botResponse.options = [
          "Buy Property",
          "Rent Property",
          "Property Types",
          "Contact",
        ];
        break;

      case "Back to Menu":
        botResponse.content = "What would you like to know about?";
        botResponse.options = [
          "Buy Property",
          "Rent Property",
          "Services",
          "Property Types",
          "Contact",
        ];
        break;

      case "Contact":
        botResponse.content =
          "You can reach us through:\n• Contact form on our website\n• Customer service number\n• Email support\n\nWould you like to contact us now?";
        botResponse.options = ["Contact Form", "Back to Menu"];
        break;

      case "Contact Form":
        botResponse.content = "Redirecting you to our contact form...";
        botResponse.options = ["Back to Menu"];
        setTimeout(() => {
          navigate("/contact-us");
        }, 1000);
        break;

      case "FAQ":
        botResponse.content =
          "Choose a category to view frequently asked questions:";
        botResponse.options = [
          "About Midland",
          "Property Services",
          "Registration & Login",
          "Property Viewing",
          "Buying & Selling",
          "Renting",
          "Back to Menu",
        ];
        break;

      case "About Midland":
        botResponse.content =
          "Q: What services does Midland Real Estate provide?\n" +
          "A: We offer services for buying, selling, and renting various properties, including flats, land, complexes, apartments, houses, villas, and rental spaces.\n\n" +
          "Q: How long has Midland been in business?\n" +
          "A: We've been serving customers for over three decades.\n\n" +
          "Q: What regions does Midland operate in?\n" +
          "A: We provide services in Guntur, Vijayawada, and Amaravathi regions.\n\n" +
          "Q: Why choose Midland Real Estate?\n" +
          "A: We offer quick transactions, personalized service, and complete property details with expert guidance at every step.";
        botResponse.options = ["More FAQ Topics", "Contact Us", "Back to Menu"];
        break;

      case "Property Services":
        botResponse.content =
          "Q: What types of properties do you handle?\n" +
          "A: We handle flats, land, complexes, apartments, houses, villas, and rental spaces.\n\n" +
          "Q: Are there properties available for rent?\n" +
          "A: Yes, we have rental properties in various locations within Guntur, Vijayawada, and Amaravathi.\n\n" +
          "Q: Are there upcoming projects?\n" +
          "A: Yes, we frequently update our listings with new projects.\n\n" +
          "Q: How quickly can transactions be completed?\n" +
          "A: We pride ourselves on fast transactions, significantly reducing the time compared to other agencies.";
        botResponse.options = [
          "More FAQ Topics",
          "View Properties",
          "Back to Menu",
        ];
        break;

      case "Registration & Login":
        botResponse.content =
          "Q: How do I register on the website?\n" +
          "A: Click the Register button and fill in your details with proof documents.\n\n" +
          "Q: What documents are needed?\n" +
          "A: Valid Aadhaar, PAN, or driving license as proof.\n\n" +
          "Q: Is my information safe?\n" +
          "A: Yes, we use advanced security measures to protect your data.\n\n" +
          "Q: What if I forget login details?\n" +
          "A: Use the Forgot Password option on the login page.";
        botResponse.options = [
          "More FAQ Topics",
          "Register Now",
          "Back to Menu",
        ];
        break;

      case "Property Viewing":
        botResponse.content =
          "Q: How do I schedule a viewing?\n" +
          "A: Click Enquire on any property, and our consultants will assist you.\n\n" +
          "Q: Are virtual tours available?\n" +
          "A: Yes, both in-person and virtual viewing options are available.\n\n" +
          "Q: Is there a viewing fee?\n" +
          "A: No, there are no fees for viewings or enquiries.\n\n" +
          "Q: What's the enquiry process?\n" +
          "A: Browse properties, click Enquire, and our consultants will guide you.";
        botResponse.options = [
          "More FAQ Topics",
          "View Properties",
          "Back to Menu",
        ];
        break;

      case "Buying & Selling":
        botResponse.content =
          "Q: How do I list my property?\n" +
          "A: Register, log in, and fill out the property listing form.\n\n" +
          "Q: What's the buying process?\n" +
          "A: Browse properties, enquire about your preferred property, and follow consultant guidance.\n\n" +
          "Q: What documents are needed to sell?\n" +
          "A: Property ownership documents, ID proof, and related certificates.\n\n" +
          "Q: How do I track my transaction?\n" +
          "A: Log in to view status under My Transactions.";
        botResponse.options = [
          "More FAQ Topics",
          "Contact Agent",
          "Back to Menu",
        ];
        break;

      case "Renting":
        botResponse.content =
          "Q: How can I find rental properties?\n" +
          "A: Register and use filters to find rentals in your preferred location.\n\n" +
          "Q: What are the rental requirements?\n" +
          "A: Valid ID proof and sometimes an agreement or deposit.\n\n" +
          "Q: Are commercial spaces available?\n" +
          "A: Yes, we offer both residential and commercial rental spaces.\n\n" +
          "Q: Are there pet-friendly rentals?\n" +
          "A: Yes, specify this requirement while enquiring.";
        botResponse.options = [
          "More FAQ Topics",
          "View Rentals",
          "Back to Menu",
        ];
        break;

      case "More FAQ Topics":
        botResponse.content = "Choose a topic to learn more:";
        botResponse.options = [
          "About Midland",
          "Property Services",
          "Registration & Login",
          "Property Viewing",
          "Buying & Selling",
          "Renting",
          "Back to Menu",
        ];
        break;

      // All other cases remain exactly the same...
      default:
        botResponse.content =
          "I'll connect you with our team for more details.";
        botResponse.options = ["Back to Menu"];
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
      if (botResponse.action) {
        botResponse.action();
      }
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-[400px] h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 flex justify-between items-center border-b border-red-400"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Midland Assistant</h3>
                  <p className="text-xs text-white/80">
                    Online | Ready to help
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {/* Messages Container */}
            <div
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent hover:scrollbar-thumb-red-300"
              style={{
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#f87171 transparent",
              }}
            >
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      x: message.type === "user" ? 20 : -20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[85%] ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white rounded-t-2xl rounded-bl-2xl"
                          : "bg-gray-100 rounded-t-2xl rounded-br-2xl"
                      } p-4 shadow-md`}
                    >
                      {message.type === "bot" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <MessageCircle size={14} className="text-white" />
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            Midland Assistant
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-line text-sm">
                        {message.content}
                      </p>
                      {message.options && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option) => (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionClick(option)}
                              className={`block w-full text-left px-4 py-2.5 rounded-xl
                                ${
                                  message.type === "user"
                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                    : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md"
                                }
                                text-sm transition-all duration-200 border border-transparent hover:border-gray-200`}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                Powered by Midland Real Estate
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
