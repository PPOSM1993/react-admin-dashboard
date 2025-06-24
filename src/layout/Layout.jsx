import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
        <nav>
          <ul className="space-y-4">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
