"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-3" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500 text-sm">{product.description}</p>
      <div className=" flex items-center justify-between mt-4">
        <span className="text-blue-600 font-bold text-[1.2rem]">৳ {product.price}</span>
       
          {/* <button onClick={() => dispatch(addToCart(product))} className="bg-gray-900 text-white px-3 py-2 rounded-full">Add</button> */}
          <Link href={`/buy-now?id=${product._id}`} className="bg-blue-600 text-white px-4 py-1 rounded-full">Buy</Link>
        
      </div>
    </div>
  );
}
