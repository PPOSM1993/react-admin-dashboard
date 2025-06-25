import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Save,
} from "lucide-react";
import { getCurrentUser, loginAs } from "../utils/auth";

function InputField({ label, name, value, onChange, icon: Icon, type = "text" }) {
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, icon: Icon, options = [] }) {
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Selecciona un rol</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUser((prev) => ({
        ...prev,
        name: current.name || "",
        email: current.email || "",
        phone: current.phone || "",
        address: current.address || "",
        role: current.role || "",
      }));
    }
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (user.password && user.password !== user.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    loginAs(user);
    alert("Datos actualizados (simulado)");
  };

  return (
    <div className="w-full px-12 py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Panel lateral con avatar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name || "Nombre Usuario"}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email || "correo@ejemplo.com"}</p>
          <span className="mt-3 px-4 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs capitalize">
            {user.role || "sin rol"}
          </span>
        </div>

        {/* Formulario grande y amplio */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Editar Perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <InputField label="Nombre" name="name" value={user.name} onChange={handleChange} icon={User} />
            <InputField label="Correo" name="email" value={user.email} onChange={handleChange} icon={Mail} type="email" />
            <InputField label="Teléfono" name="phone" value={user.phone} onChange={handleChange} icon={Phone} />
            <InputField label="Dirección" name="address" value={user.address} onChange={handleChange} icon={MapPin} />
            <SelectField label="Rol" name="role" value={user.role} onChange={handleChange} icon={Shield} options={["admin", "soporte", "técnico"]} />
            <InputField label="Contraseña" name="password" value={user.password} onChange={handleChange} icon={Lock} type="password" />
            <InputField label="Confirmar contraseña" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} icon={Lock} type="password" />
          </div>
          <div className="mt-10 text-right">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition"
            >
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
