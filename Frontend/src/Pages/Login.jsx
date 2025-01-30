import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Toast from "../Components/Toast";

const Login = ({ data, setData, setLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const validateForm = () => {
    if (!email || !password) {
      showToast("Please fill all required fields", "error");
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data: response } = await axios.post(
        "http://localhost:4000/api/auth/signin",
        { email:email, password:password },
        config
      );

      localStorage.setItem("userInfo", response.token);
      localStorage.setItem("userData", JSON.stringify(response));
      setData(response);
      setLoggedIn(true);
      showToast("You have successfully logged in", "success");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      showToast(errorMessage, "error");
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
      <div className="p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-500 hover:text-red-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
