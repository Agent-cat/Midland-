import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Building, Phone, Mail, MapPin, Edit, Eye, X, Trash2, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyLoading from "../Components/PropertyLoading";
import Toast from '../Components/Toast';

const UserProfile = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        if (!userData?._id) {
          console.error("No user ID found");
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/properties/seller/${userData._id}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (error.response?.status === 404) {
          setProperties([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [userData?._id]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/auth/update/${userData._id}`,
        formData
      );
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
      setEditMode(false);
      showToast("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Error updating profile", "error");
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const handleUpdateProperty = async (updatedData) => {
    try {
      await axios.put(
        `http://localhost:4000/api/properties/${editingProperty._id}`,
        updatedData
      );
      const response = await axios.get(
        `http://localhost:4000/api/properties/seller/${userData._id}`
      );
      setProperties(response.data);
      setShowEditModal(false);
      setEditingProperty(null);
      showToast("Property updated successfully");
    } catch (error) {
      console.error("Error updating property:", error);
      showToast(error.response?.data?.message || "Error updating property", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/properties/${propertyToDelete._id}`
      );
      setProperties(properties.filter(p => p._id !== propertyToDelete._id));
      setShowDeleteModal(false);
      setPropertyToDelete(null);
      showToast("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      showToast(error.response?.data?.message || "Error deleting property", "error");
    }
  };

  const handleStatusChange = async (property, newStatus) => {
    try {
      await axios.put(
        `http://localhost:4000/api/properties/${property._id}`,
        { ...property, status: newStatus }
      );
      const response = await axios.get(
        `http://localhost:4000/api/properties/seller/${userData._id}`
      );
      setProperties(response.data);
      showToast(`Property status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating property status:", error);
      showToast(error.response?.data?.message || "Error updating status", "error");
    }
  };

  if (loading) return <PropertyLoading />;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: "", type: "success" })}
          />
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold">{userData.username}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} />
                  <span>{userData.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} />
                  <span>{userData.address || "No address"}</span>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Properties Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">My Properties</h3>
                <span className="text-sm text-gray-500">
                  {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                </span>
              </div>
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                    >
                      <div className="relative">
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-48 object-cover"
                        />
                        {property.isVerified && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                            <BadgeCheck size={16} />
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{property.name}</h4>
                        <p className="text-gray-600 mb-2">{property.location}</p>
                        <p className="text-red-500 font-semibold">
                          ₹{property.price.toLocaleString()}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            property.status === 'available' 
                              ? 'bg-green-100 text-green-800' 
                              : property.status === 'sold'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(property)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Edit size={18} className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(property)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                            <button
                              onClick={() => navigate(`/property/${property._id}`)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Eye size={18} className="text-blue-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">You haven't listed any properties yet</p>
                  <button
                    onClick={() => navigate('/sell')}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    List a Property
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                />
              </div>
              {/* Add more form fields */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Edit Modal */}
      {showEditModal && editingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Property</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateProperty(editingProperty);
            }} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name
                  </label>
                  <input
                    type="text"
                    value={editingProperty.name}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      name: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={editingProperty.price}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      price: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={editingProperty.location}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      location: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  >
                    <option value="vijayawada">Vijayawada</option>
                    <option value="amravathi">Amravathi</option>
                    <option value="guntur">Guntur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingProperty.status}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      status: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BHK
                  </label>
                  <input
                    type="number"
                    value={editingProperty.bhk}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      bhk: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Feet
                  </label>
                  <input
                    type="number"
                    value={editingProperty.sqft}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      sqft: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={editingProperty.type}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      type: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  >
                    <option value="flats">Flats</option>
                    <option value="houses">Houses</option>
                    <option value="villas">Villas</option>
                    <option value="shops">Shops</option>
                    <option value="agriculture land">Agriculture Land</option>
                    <option value="residential land">Residential Land</option>
                    <option value="farmhouse">Farmhouse</option>
                  </select>
                </div>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={editingProperty.bedroom}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      bedroom: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={editingProperty.bathroom}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      bathroom: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kitchens
                  </label>
                  <input
                    type="number"
                    value={editingProperty.kitchen}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      kitchen: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editingProperty.address}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      address: e.target.value
                    })}
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overview
                  </label>
                  <textarea
                    value={editingProperty.overview}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      overview: e.target.value
                    })}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <textarea
                    value={editingProperty.amenities.join(", ")}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      amenities: e.target.value.split(",").map(item => item.trim())
                    })}
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Delete Confirmation Modal */}
      {showDeleteModal && propertyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Property</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{propertyToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 