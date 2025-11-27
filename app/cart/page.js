"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  decreaseQuantity,
  addToCart,
  clearCart,
  setCart,
} from "@/store/cartSlice";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function CartPage() {
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadCart() {
      if (!isSignedIn) return;
      try {
        const res = await fetch("/api/cart", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();
        const items = (data.items || [])
          .map((it) => ({
            _id: it.productId?._id,
            name: it.productId?.name,
            price: it.productId?.price,
            image: it.productId?.image,
            quantity: it.quantity,
          }))
          .filter((x) => x._id);
        dispatch(setCart(items));
      } catch (e) {
        // ignore
      }
    }
    loadCart();
  }, [isSignedIn, user?.id, dispatch]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

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
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">৳{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <button
                onClick={async () => {
                  dispatch(decreaseQuantity(item._id));
                  if (isSignedIn) {
                    const current = cartItems.find((i) => i._id === item._id);
                    const qty = Math.max(
                      (current?.quantity || item.quantity) - 1,
                      1
                    );
                    await fetch("/api/cart", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user.id,
                      },
                      body: JSON.stringify({
                        productId: item._id,
                        quantity: qty,
                      }),
                    });
                    showToast("Quantity updated");
                  }
                }}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={async () => {
                  dispatch(addToCart(item));
                  if (isSignedIn) {
                    await fetch("/api/cart", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user.id,
                      },
                      body: JSON.stringify({
                        productId: item._id,
                        quantity: 1,
                      }),
                    });
                    showToast("Saved to cart");
                  } else {
                    showToast("Added (sign in to sync)");
                  }
                }}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                +
              </button>

              <button
                onClick={async () => {
                  dispatch(removeFromCart(item._id));
                  if (isSignedIn) {
                    await fetch(`/api/cart/${item._id}`, {
                      method: "DELETE",
                      headers: { "x-user-id": user.id },
                    });
                    showToast("Removed");
                  }
                }}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">
          Total: ৳{totalAmount.toFixed(2)}
        </h2>

        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={async () => {
              if (isSignedIn) {
                await Promise.all(
                  cartItems.map((ci) =>
                    fetch(`/api/cart/${ci._id}`, {
                      method: "DELETE",
                      headers: { "x-user-id": user.id },
                    })
                  )
                );
              }
              dispatch(clearCart());
              showToast("Cart cleared");
            }}
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
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
