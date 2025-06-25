import SidebarPro from "../components/Sidebar";
import Header from "../components/Header";
import { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Actualiza el tamaño de ventana si se redimensiona
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = useMemo(() => (collapsed ? 80 : 256), [collapsed]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white overflow-hidden">
      <SidebarPro open={sidebarOpen} setOpen={setSidebarOpen} collapsed={collapsed} />

      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out overflow-x-auto"
        style={{
          marginLeft: windowWidth >= 640 ? sidebarWidth : 0,
        }}
      >
        <Header
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-auto overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
