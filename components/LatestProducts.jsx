"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch("https://nextshop-backend.onrender.com/api/products");
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sorted.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">Loading latest products...</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">No products found.</div>
    );
  }

  return (
    <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        🛍️ Latest Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="w-full h-56 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-1">
                {product.description?.slice(0, 60)}...
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  ৳{product.price}
                </span>
                <Link href={`/buy-now?id=${product._id}`}>
                  <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
