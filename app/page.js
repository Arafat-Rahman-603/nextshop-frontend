import Hero from "@/components/Hero";
import Link from "next/link";
import LatestProducts from "@/components/LatestProducts";


export default function Home() {
  return (
    <div>
      <Hero />
      <LatestProducts />
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Amazing Deals</h2>
        <p className="text-gray-600 mb-10">Shop the latest gadgets and accessories at NextShop.</p>
        <Link href="/products" className="bg-blue-600 px-6 py-3 rounded-full text-white hover:scale-110 transition-all">Shop Products</Link>
      </section>
    </div>
  );
}
