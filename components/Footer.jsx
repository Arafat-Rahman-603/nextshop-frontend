export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto text-center space-y-3">
        <p>&copy; {new Date().getFullYear()} NextShop. All rights reserved.</p>
        <p className="text-gray-400 text-sm">Developed by Arafat Rahman</p>
      </div>
    </footer>
  );
}
