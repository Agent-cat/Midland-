import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  User,
  Home,
  Search,
  Building,
  Users,
  UserCog,
  X,
  AlertTriangle,
  Check,
  MessageSquare,
  Eye,
  Clock,
  Bell,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyLoading from "../Components/PropertyLoading";

const AdminPanel = ({ properties, refreshProperties }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyViews, setPropertyViews] = useState([]);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedViewDetails, setSelectedViewDetails] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [newViews, setNewViews] = useState([]);
  const [hasUnreadViews, setHasUnreadViews] = useState(false);
  const [viewsFilter, setViewsFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    price: "",
    saleOrRent: "",
    address: "",
    ownerName: "",
    bhk: "",
    sqft: "",
    overview: "",
    amenities: [],
    details: "",
    kitchen: "",
    bathroom: "",
  });
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchAllViews();
    const interval = setInterval(fetchAllViews, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/users");
      const allUsers = response.data;
      setUsers(allUsers.filter((user) => user.role === "client"));
      setAgents(allUsers.filter((user) => user.role === "agent"));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchAllViews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/properties/all-views"
      );
      const views = response.data;
      setNewViews(views);

      const recentViews = views.filter((view) => {
        const viewDate = new Date(view.viewedAt);
        const now = new Date();
        return now - viewDate < 24 * 60 * 60 * 1000;
      });
      setHasUnreadViews(recentViews.length > 0);
    } catch (error) {
      console.error("Error fetching views:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:4000/api/properties/${propertyToDelete._id}`
      );
      refreshProperties();
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/contacts/${contactId}`, {
        status: newStatus,
      });
      fetchContacts();
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const handlePropertyClick = (propertyId) => {
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      navigate(`/property/${propertyId}`, {
        state: { propertyData: property },
      });
    } else {
      fetchAndNavigateToProperty(propertyId);
    }
  };

  const fetchAndNavigateToProperty = async (propertyId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/properties/${propertyId}`
      );
      navigate(`/property/${propertyId}`, {
        state: { propertyData: response.data },
      });
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  const filteredData = () => {
    const searchLower = searchTerm.toLowerCase();
    switch (activeTab) {
      case "properties":
        return properties.filter(
          (property) =>
            property.name.toLowerCase().includes(searchLower) ||
            property.location.toLowerCase().includes(searchLower)
        );
      case "users":
        return users.filter(
          (user) =>
            user.username.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
      case "agents":
        return agents.filter(
          (agent) =>
            agent.username.toLowerCase().includes(searchLower) ||
            agent.email.toLowerCase().includes(searchLower)
        );
      default:
        return [];
    }
  };

  const tabs = [
    { id: "properties", label: "Properties", icon: Building },
    { id: "users", label: "Users", icon: Users },
    { id: "agents", label: "Agents", icon: UserCog },
    { id: "contacts", label: "Contacts", icon: MessageSquare },
    {
      id: "views",
      label: "Views",
      icon: Eye,
      notification: hasUnreadViews,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquare,
    },
  ];

  const fetchPropertyViews = async (propertyId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/properties/${propertyId}/views`
      );
      setPropertyViews(response.data);
    } catch (error) {
      console.error("Error fetching property views:", error);
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    fetchPropertyViews(property._id);
  };

  const updateViewStatus = async (viewId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/properties/views/${viewId}`, {
        status: newStatus,
      });
      fetchAllViews();
      showAlert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating view status:", error);
      showAlert("Failed to update status", "error");
    }
  };

  const handleUserClick = (view) => {
    setSelectedViewDetails(view);
    setRemarks(view.remarks || "");
    setShowUserDetailsModal(true);
  };

  const handleRemarksUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/properties/views/${selectedViewDetails._id}`,
        {
          status: selectedViewDetails.status,
          remarks: remarks,
        }
      );
      fetchAllViews();
      setShowUserDetailsModal(false);
      showAlert("Remarks updated successfully!");
    } catch (error) {
      console.error("Error updating remarks:", error);
      showAlert("Failed to update remarks", "error");
    }
  };

  const ViewStatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock size={14} className="text-yellow-600" />,
      },
      interested: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <Check size={14} className="text-green-600" />,
      },
      not_interested: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <X size={14} className="text-red-600" />,
      },
    };

    return (
      <span
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig[status].color}`}
      >
        {statusConfig[status].icon}
        {status.replace("_", " ").charAt(0).toUpperCase() +
          status.slice(1).replace("_", " ")}
      </span>
    );
  };

  const getFilteredViews = () => {
    return newViews.filter((view) => {
      const viewDate = new Date(view.viewedAt);
      const now = new Date();
      switch (viewsFilter) {
        case "today":
          return viewDate.toDateString() === now.toDateString();
        case "week":
          return now - viewDate < 7 * 24 * 60 * 60 * 1000;
        case "month":
          return now - viewDate < 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setEditForm({
      name: property.name,
      location: property.location,
      price: property.price,
      saleOrRent: property.saleOrRent,
      address: property.address,
      ownerName: property.ownerName,
      bhk: property.bhk,
      sqft: property.sqft,
      overview: property.overview,
      amenities: property.amenities,
      details: property.details,
      kitchen: property.kitchen,
      bathroom: property.bathroom,
    });
    setShowEditModal(true);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/properties/${editingProperty._id}`,
        editForm
      );
      refreshProperties();
      setShowEditModal(false);
      showAlert("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      showAlert("Failed to update property", "error");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this property?"
      );
      if (confirmDelete) {
        await axios.delete(
          `http://localhost:4000/api/properties/${propertyId}`
        );
        refreshProperties();
        showAlert("Property deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      showAlert("Failed to delete property", "error");
    }
  };

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleMarkAsReviewed = async (feedbackId) => {
    try {
      await axios.put(`http://localhost:4000/api/feedback/${feedbackId}`, {
        status: "reviewed",
      });
      fetchFeedbacks(); // Refresh feedbacks after update
      showAlert("Feedback marked as reviewed", "success");
    } catch (error) {
      console.error("Error updating feedback status:", error);
      showAlert("Failed to update feedback status", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <PropertyLoading />;
    }

    switch (activeTab) {
      case "properties":
        return (
          <div className="space-y-6">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredData().map((property) => (
                <motion.div
                  key={property._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative group">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(property);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={20} className="text-blue-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(property);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit Property"
                      >
                        <Edit size={20} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProperty(property._id);
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 size={20} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-2 md:hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(property);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Eye size={18} className="text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(property);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Edit size={18} className="text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProperty(property._id);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {property.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-red-500 font-bold">
                        ₹{property.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Eye size={16} />
                        <span>{property.views?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Property Views Modal */}
            {selectedProperty && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Property Views
                      </h2>
                      <p className="text-gray-600">
                        {selectedProperty.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProperty(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {propertyViews.length > 0 ? (
                      propertyViews.map((view) => (
                        <div
                          key={view._id}
                          className="bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={view.userId.profilePicture}
                                alt={view.userId.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {view.userId.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {view.userId.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Phone: {view.phone || "No phone number"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(view.viewedAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <ViewStatusBadge status={view.status} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-600 font-medium">
                          No Views Yet
                        </h3>
                        <p className="text-sm text-gray-500">
                          This property hasn't received any views yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "users":
      case "agents":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredData().map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="border rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-red-500"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      {user.username}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {user.email}
                    </p>
                    <span className="inline-block px-2 sm:px-3 py-1 mt-2 text-xs font-medium rounded-full bg-red-100 text-red-600">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "contacts":
        return (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white rounded-lg shadow p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-full sm:w-auto">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={contact.propertyId.images[0]}
                        alt={contact.propertyId.name}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
                        onClick={() =>
                          handlePropertyClick(contact.propertyId._id)
                        }
                      />
                      <div>
                        <h3
                          className="text-base sm:text-lg font-semibold mb-2 hover:text-red-500 cursor-pointer"
                          onClick={() =>
                            handlePropertyClick(contact.propertyId._id)
                          }
                        >
                          {contact.propertyId.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-1">
                          From: {contact.name}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mb-1">
                          Email: {contact.email}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mb-1">
                          Phone: {contact.phone}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {contact.message}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        contact.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : contact.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                    <select
                      value={contact.status}
                      onChange={(e) =>
                        handleStatusUpdate(contact._id, e.target.value)
                      }
                      className="px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "views":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Property Views
              </h2>
              <div className="flex items-center gap-4">
                <select
                  value={viewsFilter}
                  onChange={(e) => setViewsFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button
                  onClick={fetchAllViews}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Refresh Views"
                >
                  <RefreshCw size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {getFilteredViews().map((view) => (
                <div
                  key={view._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-6">
                    {view.propertyId?.images?.length > 0 ? (
                      <div
                        className="w-48 h-32 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() =>
                          handlePropertyClick(view.propertyId._id)
                        }
                      >
                        <img
                          src={view.propertyId.images[0]}
                          alt={view.propertyId.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            {view.userId.profilePicture ? (
                              <img
                                src={view.userId.profilePicture}
                                alt={view.userId.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {view.userId.username}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Mail size={14} />
                                {view.userId.email}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone size={14} />
                                {view.phone || "No phone number"}
                              </p>
                              <p className="flex items-center gap-2">
                                <Clock size={14} />
                                {new Date(view.viewedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <h3
                            className="text-lg font-semibold text-gray-900 hover:text-red-500 cursor-pointer mb-1"
                            onClick={() =>
                              handlePropertyClick(view.propertyId._id)
                            }
                          >
                            {view.propertyId?.name ||
                              "Property Name Not Available"}
                          </h3>
                          <p className="text-gray-600 mb-1">
                            {view.propertyId?.location}
                          </p>
                          {view.propertyId?.price && (
                            <p className="text-red-500 font-semibold">
                              ₹{view.propertyId.price.toLocaleString()}
                            </p>
                          )}
                          <ViewStatusBadge status={view.status} />
                        </div>
                      </div>

                      {view.remarks && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Remarks:</span>{" "}
                            {view.remarks}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end items-center gap-3">
                        <button
                          onClick={() => handleUserClick(view)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Add/Edit Remarks"
                        >
                          <MessageSquare size={16} />
                          Add Remarks
                        </button>
                        <select
                          value={view.status}
                          onChange={(e) =>
                            updateViewStatus(view._id, e.target.value)
                          }
                          className="px-3 py-1.5 text-sm border rounded-lg bg-white hover:border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="interested">Interested</option>
                          <option value="not_interested">
                            Not Interested
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getFilteredViews().length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-600 font-medium mb-1">
                  No Views Found
                </h3>
                <p className="text-sm text-gray-500">
                  There are no property views matching your filter criteria.
                </p>
              </div>
            )}
          </div>
        );
      case "feedback":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
            <div className="grid gap-4">
              {feedbacks.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No feedback received yet</p>
                </div>
              ) : (
                feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {feedback.subject || "No Subject"}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          From:{" "}
                          {feedback.username?.username || "Unknown User"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {feedback.createdAt
                            ? new Date(
                                feedback.createdAt
                              ).toLocaleDateString()
                            : "Date not available"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          feedback.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {feedback.status || "pending"}
                      </span>
                    </div>
                    <p className="mt-4 text-gray-700">
                      {feedback.message || "No message content"}
                    </p>
                    {feedback.status === "pending" && (
                      <button
                        onClick={() => handleMarkAsReviewed(feedback._id)}
                        className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-2"
                      >
                        <Check size={16} />
                        Mark as Reviewed
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Component */}
      {alert.show && (
        <div
          className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            alert.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-4xl text-center font-bold text-red-500 mb-4 sm:mb-6">
            Admin Dashboard
          </h1>

          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-xs sm:text-base relative ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.notification && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full shadow-2xl m-4">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Are you sure you want to delete "{propertyToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                {selectedUser.profilePicture ? (
                  <img
                    src={selectedUser.profilePicture}
                    alt={selectedUser.username}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-red-500"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    {selectedUser.username}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedUser.email}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Phone: {selectedUser.phno}
                  </p>
                  <span className="inline-block px-3 py-1 mt-2 text-xs sm:text-sm font-medium rounded-full bg-red-100 text-red-600">
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {selectedUser.role === "agent" && (
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-4">
                    Listed Properties
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties
                      .filter(
                        (prop) => prop.ownerName === selectedUser.username
                      )
                      .map((property) => (
                        <div
                          key={property._id}
                          className="border rounded-xl overflow-hidden shadow-md"
                        >
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <p className="font-semibold text-sm sm:text-base">
                              {property.name}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {property.location}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal &&
        selectedViewDetails &&
        selectedViewDetails.propertyId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">User Details</h3>
                <button
                  onClick={() => setShowUserDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    {selectedViewDetails.userId.profilePicture ? (
                      <img
                        src={selectedViewDetails.userId.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {selectedViewDetails.userId.username}
                    </h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={16} />
                        {selectedViewDetails.userId.email}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone size={16} />
                        {selectedViewDetails.phone || "No phone number"}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock size={16} />
                        Viewed on:{" "}
                        {new Date(
                          selectedViewDetails.viewedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-700 mb-3">
                    Viewed Property
                  </h5>
                  <div
                    className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setShowUserDetailsModal(false);
                      handlePropertyClick(selectedViewDetails.propertyId._id);
                    }}
                  >
                    {selectedViewDetails.propertyId.images &&
                    selectedViewDetails.propertyId.images.length > 0 ? (
                      <img
                        src={selectedViewDetails.propertyId.images[0]}
                        alt={selectedViewDetails.propertyId.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Home size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h6 className="font-medium text-gray-800">
                        {selectedViewDetails.propertyId.name ||
                          "Property Name Not Available"}
                      </h6>
                      <p className="text-sm text-gray-600">
                        {selectedViewDetails.propertyId.location ||
                          "Location Not Available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedViewDetails.status}
                      onChange={(e) => {
                        updateViewStatus(
                          selectedViewDetails._id,
                          e.target.value
                        );
                        setSelectedViewDetails({
                          ...selectedViewDetails,
                          status: e.target.value,
                        });
                      }}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="interested">Interested</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full p-3 border rounded-lg min-h-[100px] focus:ring-2 focus:ring-red-300 focus:border-red-500"
                      placeholder="Add your remarks here..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowUserDetailsModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemarksUpdate}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Edit Property</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProperty} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  >
                    <option value="vijayawada">Vijayawada</option>
                    <option value="amravathi">Amravathi</option>
                    <option value="guntur">Guntur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale/Rent
                  </label>
                  <select
                    value={editForm.saleOrRent}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        saleOrRent: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={editForm.ownerName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        ownerName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BHK
                  </label>
                  <input
                    type="number"
                    value={editForm.bhk}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        bhk: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={editForm.sqft}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        sqft: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitchen
                  </label>
                  <input
                    type="number"
                    value={editForm.kitchen}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        kitchen: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathroom
                  </label>
                  <input
                    type="number"
                    value={editForm.bathroom}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        bathroom: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    required
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overview
                  </label>
                  <textarea
                    value={editForm.overview}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        overview: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Details
                  </label>
                  <textarea
                    value={editForm.details}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        details: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.amenities.join(", ")}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        amenities: e.target.value
                          .split(",")
                          .map((item) => item.trim()),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    placeholder="e.g., WiFi, Parking, Garden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Update Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
