"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <Provider store={store}>
            <Navber />
            <main>{children}</main>
            <Footer />
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
