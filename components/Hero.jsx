"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvIvvuHtaW3DFi2rgJVErmbFWGAkuVrTaQvw&s",
  "https://berle.com/cdn/shop/articles/pexels-pavel-danilyuk-6712119.jpg?v=1638907627&width=1024",
  "https://petiterevery.nestdesigns.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fpetiterevery%2FZuHqNhoQrfVKl_S8_WinterClothes_1.jpg%3Fauto%3Dformat%2Ccompress&w=3840&q=75"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i+1)%images.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {images.map((src, i) => (
        <motion.img key={i} src={src} alt="" initial={{opacity:0}} animate={{opacity: i===index?1:0}} transition={{duration:1}} className="absolute inset-0 w-full h-full object-cover" />
      ))}
     
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3">Welcome to NextShop</h1>
        <p className="max-w-2xl text-lg md:text-xl mb-6">Find everything you need — fast, secure, and at great prices.</p>
        <div className="flex gap-4">
          <Link href="/products" className="bg-blue-600 px-5 py-3 rounded-full hover:scale-110 transition-transform">Shop Now</Link>
          <Link href="/about" className="border border-white px-5 py-3 rounded-full hover:scale-110 transition-transform">About</Link>
        </div>
      </div>
    </section>
  );
}
