"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, decreaseQuantity, addToCart, clearCart } from "@/store/cartSlice";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛍️</h2>
        <Link href="/products" className="text-blue-500 underline">
          Go Shopping
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <button
                onClick={() => dispatch(decreaseQuantity(item._id))}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => dispatch(addToCart(item))}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                +
              </button>

              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</h2>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => dispatch(clearCart())}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700"
          >
            Clear Cart
          </button>

          <Link
            href="/buy-now"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
