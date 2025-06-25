import SidebarPro from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer"; // 👈 importar

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // cerrado por defecto en móvil
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white overflow-hidden">
      <SidebarPro open={sidebarOpen} setOpen={setSidebarOpen} collapsed={collapsed} />

      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: window.innerWidth >= 640 ? sidebarWidth : 0,
        }}
      >
        <Header
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
