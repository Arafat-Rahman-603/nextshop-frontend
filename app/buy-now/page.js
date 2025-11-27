"use client";

import { Suspense } from "react";
import BuyNow from "@/components/BuyNow";
import Spinner from "@/components/Spinner";

export const dynamic = "force-dynamic"; 

export default function Page() {
  return (
    <Suspense fallback={<Spinner label="Loading..." />}> 
      <BuyNow />
    </Suspense>
  );
}
