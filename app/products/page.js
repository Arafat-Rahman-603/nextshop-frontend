"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import Spinner from "@/components/Spinner";
import ProductCard from "@/components/ProductCard";

// ✅ Better shuffle (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = array.slice(); // faster than spread for large arrays
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((s) => s.products);

  // ✅ Fetch once
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Memoized shuffle (runs only when items change)
  const randomItems = useMemo(() => {
    if (!items.length) return [];
    return shuffleArray(items);
  }, [items]);

  if (loading) return <Spinner label="Loading products..." />;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">
        Products
      </h1>

      <div className="max-w-7xl mx-auto grid gap-6 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {randomItems.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}