import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import ProtectedRoute from "../router/ProtectedRoute";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import RolesPermissionsTable from "../pages/RolesPermissionsTable";
import Sales from '../pages/Sales';
import Products from '../pages/Products'
import Category from '../pages/Category';
import Customers from "../pages/Customers";
import Orders from "../pages/Orders";
import Contact from '../pages/Contact';
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Buy from '../pages/Buy'
import Suppliers from "../pages/Suppliers";
import Invoices from '../pages/Invoices';
import Payments from '../pages/Payments';
import Reports from "../pages/Reports";
import WorkOrders from "../pages/WorkOrders";
import SupportTickets from "../pages/SupportTickets";
import Workers from "../pages/Workers";
import Attendance from "../pages/Attendance";
import Inventory from "../pages/Inventory";
import StockMovements from "../pages/StockMovements";
import Terms from "../pages/Terms";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

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
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/tickets" element={<SupportTickets />} />
          <Route path="/staff" element={<Workers />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stock-movements" element={<StockMovements />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

