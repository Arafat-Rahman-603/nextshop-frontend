"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function BuyNowPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const { user, isSignedIn } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const endpoint = "https://get-mail-backend.onrender.com/send";

  // Get product or cart from Redux
  const product = useSelector((state) =>
    state.products.items.find((p) => p._id === id)
  );
  const cart = useSelector((state) => state.cart);

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  const isCartCheckout = !id;

  useEffect(() => {
    async function fetchProduct() {
      if (!id || product) return;
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setFetchedProduct(data);
      } catch (e) {
        // ignore
      }
    }
    fetchProduct();
  }, [id, product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setSending(true);

    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      email: user?.primaryEmailAddress?.emailAddress || "no-email@unknown.com",
      message: isCartCheckout
        ? `✅ Cart Checkout Confirmed!
Items:
${cart.cartItems
  .map((ci) => `- ${ci.name} x${ci.quantity} ($${ci.price})`)
  .join("\n")}
Total: $${(cart.totalAmount + 65).toFixed(2)}
Shipping Address: ${form.address.value.trim()}
Phone: ${form.phone.value.trim()}`
        : `✅ Purchase Confirmed!
Product: ${(product || fetchedProduct)?.name}
Image: ${(product || fetchedProduct)?.image}
Quantity: ${quantity}
Total: $${(((product || fetchedProduct)?.price || 0) * quantity + 65).toFixed(
            2
          )}
Shipping Address: ${form.address.value.trim()}
Phone: ${form.phone.value.trim()}`,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("✅ Purchase confirmed!");
        setTimeout(
          () => router.push(isCartCheckout ? "/cart" : "/products"),
          3000
        );
        form.reset();
      } else {
        const error = await res.text();
        setStatus("❌ Failed to send email: " + error);
      }
    } catch (err) {
      console.error(err);
      setStatus("🌐 Network error. Try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          {isCartCheckout
            ? "Cart Checkout"
            : (product || fetchedProduct)?.name || "Loading..."}
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {!isCartCheckout && (product || fetchedProduct) && (
            <img
              src={(product || fetchedProduct).image}
              alt={(product || fetchedProduct).name}
              className="w-full md:w-1/2 h-max object-cover rounded"
            />
          )}
          <div className="flex-1">
            {!isCartCheckout ? (
              <p className="text-gray-700 mb-4">
                {(product || fetchedProduct)?.description}
              </p>
            ) : (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Items</h2>
                <ul className="space-y-1">
                  {cart.cartItems.map((ci) => (
                    <li key={ci._id} className="text-gray-700">
                      {ci.name} x{ci.quantity} — ৳{ci.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p className="text-gray-600">Shipping fee:</p>
              <p className="text-gray-600">৳65</p>
            </div>

            {!isCartCheckout ? (
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ৳{(product || fetchedProduct)?.price}
              </p>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="name"
                className="w-full p-3 border rounded"
                placeholder="Full name"
                defaultValue={user?.fullName || ""}
                required
              />
              <input
                name="address"
                className="w-full p-3 border rounded"
                placeholder="Shipping address"
                required
              />
              <input
                name="phone"
                className="w-full p-3 border rounded"
                placeholder="Phone number"
                required
              />
              {!isCartCheckout && (
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 border rounded"
                  placeholder="Quantity"
                  required
                />
              )}

              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total:</p>
                <p className="text-gray-600">
                  {isCartCheckout
                    ? `$${(cart.totalAmount + 65).toFixed(2)}`
                    : `$${(
                        ((product || fetchedProduct)?.price || 0) * quantity +
                        65
                      ).toFixed(2)}`}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600">Payment Type:</p>
                <p className="text-gray-600">Cash On Delivery</p>
              </div>

              <button
                disabled={sending}
                className="w-full bg-blue-600 text-white py-3 rounded hover:scale-95 transition-transform"
              >
                {sending ? "Confirming..." : "Confirm Purchase"}
              </button>
            </form>

            {status && (
              <p className="text-center mt-4 text-sm text-gray-700">{status}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
