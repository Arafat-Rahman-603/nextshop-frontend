export default function Blog() {
  const posts = [
    {title:"Top Gadgets of 2025", desc:"The best gadgets you should consider."},
    {title:"Ecommerce Tips", desc:"Grow your online sales with these tips."},
    {title:"Sustainable Electronics", desc:"Eco-friendly devices worth buying."}
  ];
  return (
    <div className="min-h-screen py-16 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Blog</h1>
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
        {posts.map((p,i)=>(
          <div key={i} className="bg-white p-6 rounded-xl shadow">{/* simpler card */}
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="text-gray-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
