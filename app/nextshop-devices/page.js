export default function Devices() {
  const devices = [
    { name: "NextPhone X5", price: 899, img: "/devices/phone.jpg" },
    { name: "NextPad Pro", price: 1099, img: "/devices/pad.jpg" },
    { name: "NextWatch Ultra", price: 499, img: "/devices/watch.jpg" },
  ];
  return (
    <div className="min-h-screen py-16 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">NextShop Devices</h1>
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {devices.map((d, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow">
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-44 object-cover rounded mb-4"
            />
            <h2 className="font-semibold">{d.name}</h2>
            <p className="text-blue-600 font-bold">${d.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
