import { Suspense } from "react";
import ChantierDetailClient from "./ChantierDetailClient";

export default function ChantierDetailPage() {
  return (
    <Suspense>
      <ChantierDetailClient />
    </Suspense>
  );
}
