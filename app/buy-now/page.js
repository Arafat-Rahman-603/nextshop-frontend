"use client";

import { Suspense } from "react";
import BuyNow from "@/components/BuyNow";

export const dynamic = "force-dynamic"; 

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <BuyNow />
    </Suspense>
  );
}
