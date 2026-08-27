import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import useAuth from "@/auth/store";

export default function RootLayout() {
  const hydrate = useAuth((state) => state.hydrate);
  const didHydrate = useRef(false);

  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;
    void hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Outlet />
      <Toaster
        position="top-right"
        containerStyle={{ top: 20, right: 20, zIndex: 9999 }}
      />
    </div>
  );
}
