import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ProtectedRoute from "../router/ProtectedRoute";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import RolesPermissionsTable from "../pages/RolesPermissionsTable";
import Sales from '../pages/Sales'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roles" element={<RolesPermissionsTable />} />
          <Route path="/sales" element={<Sales />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}