"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/productSlice";
import Spinner from "@/components/Spinner";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.products);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  if (loading) return <Spinner label="Loading products..." />;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Products</h1>
      <div className="max-w-7xl mx-auto grid gap-6 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(p => <ProductCard key={p._id} product={p} /> )}
      </div>
    </div>
  );
}
