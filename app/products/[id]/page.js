"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Spinner from "@/components/Spinner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  };

  if (loading) return <Spinner label="Loading product..." />;
  if (!product)
    return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            ৳{product.price}
          </p>
          <div className="flex gap-3">
            <button
              className="bg-gray-900 cursor-pointer hover:bg-gray-700 text-white px-4 py-2 rounded"
              onClick={async () => {
                dispatch(addToCart(product));
                if (isSignedIn) {
                  await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-user-id": user.id,
                    },
                    body: JSON.stringify({
                      productId: product._id,
                      quantity: 1,
                    }),
                  });
                  showToast("Saved to cart");
                } else {
                  showToast("Added (sign in to sync)");
                }
              }}
            >
              Add to Cart
            </button>
            <Link
              href={`/buy-now?id=${product._id}`}
              className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-500 cursor-pointer rounded"
            >
              Buy Now
            </Link>
          </div>
          {toast && <div className="mt-2 text-xs text-green-600">{toast}</div>}
        </div>
      </div>
    </div>
  );
}