import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

// PWA install prompt
export let installPrompt: Event | null;

const Root = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="pt-28 px-4 md:px-8 container mx-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

// Capture and prevent default install prompt behavior
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
});

export default Root;
