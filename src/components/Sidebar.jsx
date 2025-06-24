import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
}
