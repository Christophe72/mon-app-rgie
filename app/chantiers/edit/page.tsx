import { Suspense } from "react";
import EditChantierClient from "./EditChantierClient";

export default function EditChantierPage() {
  return (
    <Suspense>
      <EditChantierClient />
    </Suspense>
  );
}
