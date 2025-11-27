"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  };
  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col relative pb-15">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500 text-sm">{product.description}</p>
      <div className=" flex items-center justify-between mt-4 w-[90%] absolute bottom-5 ">
        <span className="text-blue-600 font-bold text-[1.2rem]">
          ৳ {product.price}
        </span>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={async () => {
              dispatch(addToCart(product));
              if (isSignedIn) {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                  },
                  body: JSON.stringify({ productId: product._id, quantity: 1 }),
                });
                showToast("Saved to cart");
              } else {
                showToast("Added (sign in to sync)");
              }
            }}
            className="bg-gray-900 text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-all cursor-pointer"
          >
            Add
          </button>
          <Link
            href={`/buy-now?id=${product._id}`}
            className="bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
          >
            Buy
          </Link>
        </div>
      </div>
      {toast && <div className="mt-2 text-xs text-green-600">{toast}</div>}
    </div>
  );
}
