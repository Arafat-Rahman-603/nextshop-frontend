"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const router = useRouter();
  const { cartItems } = useSelector((state) => state.cart);
  const { isSignedIn } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },
    { name: "Blog", path: "/blog" },
  ];

  // 🔹 Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  // 🔹 Handle Search (manual or on typing)
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // 🔹 When selecting product suggestion
  const handleSelectProduct = (id) => {
    router.push(`/products/${id}`);
    setSearchTerm("");
    setFilteredProducts([]);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg relative z-50">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide hover:text-blue-400 transition-colors duration-300"
        >
          NextShop
        </Link>

        {/* 🔹 Desktop Search Bar */}
        <div className="hidden md:flex flex-col items-center relative">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 rounded-full w-[300px] bg-gray-700 focus:outline-none ring-1 ring-gray-500 focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {filteredProducts.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white text-black rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product._id} // ✅ FIXED: use _id instead of id
                  onClick={() => handleSelectProduct(product._id)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="py-1 px-4 text-base font-medium rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              {item.name}
              {item.name === "Cart" && cartItems.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2">
                  {cartItems.length}
                </span>
              )}
            </Link>
          ))}

          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { userButtonAvatarBox: "w-12 h-12" } }}
            />
          ) : (
            <SignInButton>
              <button className="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 transition">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        {/* 🔹 Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl focus:outline-none hover:text-blue-400 transition-colors duration-300"
        >
          {isOpen ? <IoCloseSharp /> : <CiMenuFries />}
        </button>
      </nav>

      {/* 🔹 Mobile Search */}
      <div className="md:hidden block bg-gray-900 py-2 px-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-full w-full bg-gray-800 text-white focus:outline-none ring-1 ring-gray-500 focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-2 bg-white text-black rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleSelectProduct(product._id)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Mobile Menu Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center space-y-8 z-40"
          >
            {menuItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-semibold hover:text-blue-400 transition-all duration-300"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                />
              ) : (
                <SignInButton>
                  <button
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
