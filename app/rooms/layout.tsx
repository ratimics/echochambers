
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/loader";
import { Suspense } from "react";

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Suspense fallback={<Loader />}>
        <main className="flex-1">{children}</main>
      </Suspense>
    </div>
  );
}
