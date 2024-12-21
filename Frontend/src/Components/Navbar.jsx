import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { Navlinks } from "../Constants/Constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu, X, UserCircle, LogOut, ShoppingCart, User } from "lucide-react";
import LoginRoutes from "../Routes/LoginRoutes";
import Cart from "./Cart";

const Navbar = ({ data, setData, loggedIn, setLoggedIn }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const popupRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useGSAP(() => {
    const activeLink = document.querySelector(".nav-links .text-red-500");
    const underline = document.querySelector(".nav-underline");
    if (activeLink && underline) {
      gsap.to(underline, {
        width: activeLink.offsetWidth,
        x: activeLink.offsetLeft,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [location]);

  useEffect(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        x: isMenuOpen ? "0%" : "100%",
        duration: 0.5,
        ease: "power3.inOut",
      });

      if (isMenuOpen) {
        gsap.fromTo(
          menuItemsRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("userInfo");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      setLoggedIn(true);
      setData(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userData");
    setLoggedIn(false);
    setData(null);
    setShowUserMenu(false);
  };

  const filteredNavlinks = Navlinks.filter((link) => {
    if (link.adminOnly) {
      return loggedIn && data?.role === "admin";
    }
    return true;
  });

  return (
    <>
      <nav
        ref={navbarRef}
        className={`flex py-6 cursor-auto md:py-0 select-none rounded-2xl m-2 font-semibold bg-[#d5dbde] text-md font-['Onest',sans-serif] justify-between items-center fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Link
          to="/"
          className="md:ml-4 flex gap-2 text-red-400 ml-8 md:text-gray-700 text-2xl font-bold"
        >
          Midland
          <span className="text-red-400  hidden md:flex">Real-Estate</span>
        </Link>
        <div className="hidden md:flex gap-8 relative nav-links">
          {filteredNavlinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.link}
              className={({ isActive }) =>
                `hover:text-red-500 hover:-translate-y-1 transition-all duration-300 py-6 hover:font-bold font-semibold text-gray-700 ${
                  isActive ? "text-red-500 font-bold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="absolute bottom-0 h-0.5 bg-red-500 nav-underline" />
        </div>
        <div className="hidden md:flex mt-2 h-full mr-9 gap-4">
          {loggedIn && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-md  transition-colors duration-300"
            >
              <ShoppingCart color="red" size={25} />
            </button>
          )}
          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-4 px-3 py-2 text-gray-700 rounded-lg  transition-all duration-300"
              >
                {data?.pic ? (
                  <img
                    src={data.pic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2  transition-all duration-300 shadow-md"
                  />
                ) : (
                  <UserCircle size={32} className="text-gray-600" />
                )}
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-md font-['Onest',sans-serif] text-gray-900">
                    {data?.name}
                  </span>
                  <span className="text-xs text-gray-500">{data?.email}</span>
                </div>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  <Link
                    to="/profile"
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <User size={16} className="mr-3" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogOut size={16} className="mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                onClick={openLogin}
                className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={openRegister}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden mr-4">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        ref={menuRef}
        className="fixed top-0 right-0 w-full h-full bg-[#d5dbde] z-40 transform translate-x-full"
      >
        <div className="flex flex-col items-center justify-center h-full">
          {filteredNavlinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.link}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-3xl mb-8 hover:text-red-500 transition-all duration-300 ${
                  isActive ? "text-red-500 font-bold" : "text-gray-700"
                }`
              }
              ref={(el) => (menuItemsRef.current[index] = el)}
            >
              {link.name}
            </NavLink>
          ))}
          <div className="flex flex-row gap-6 mt-8">
            {loggedIn ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-3 px-6 py-4">
                  {data?.pic ? (
                    <img
                      src={data.pic}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-3 border-red-400 shadow-lg"
                    />
                  ) : (
                    <UserCircle size={48} className="text-gray-600" />
                  )}
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-xl text-gray-800">
                      {data?.name}
                    </span>
                    <span className="text-sm text-gray-500">Member</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-6 py-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => {
                    openLogin();
                    setIsMenuOpen(false);
                  }}
                  className="px-8 py-3 bg-red-400 text-white text-xl rounded-md hover:bg-red-500 transition-colors duration-300"
                  ref={(el) =>
                    (menuItemsRef.current[filteredNavlinks.length] = el)
                  }
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => {
                    openRegister();
                    setIsMenuOpen(false);
                  }}
                  className="px-8 py-3 bg-gray-400 text-white text-xl rounded-md hover:bg-gray-500 transition-colors duration-300"
                  ref={(el) =>
                    (menuItemsRef.current[filteredNavlinks.length + 1] = el)
                  }
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {!loggedIn && (showLogin || showRegister) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popupRef} className="rounded-lg relative">
            <Link
              to="/"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(false);
              }}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300 shadow-lg"
            >
              <X size={20} />
            </Link>
            <LoginRoutes
              data={data}
              setData={setData}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
