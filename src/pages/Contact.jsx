import { useState } from "react";
import { X } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validar email simple
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.email.trim()) newErrors.email = "El email es requerido";
    else if (!validateEmail(form.email)) newErrors.email = "Email inválido";
    if (!form.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!form.message.trim()) newErrors.message = "El mensaje es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Aquí puedes integrar envío real a backend o email
    console.log("Enviando formulario:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Contacto
      </h2>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          ¡Mensaje enviado con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
          Nombre
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Tu nombre"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </label>

        <label className="block mb-1 mt-4 text-gray-700 dark:text-gray-300 font-medium">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="ejemplo@correo.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </label>

        <label className="block mb-1 mt-4 text-gray-700 dark:text-gray-300 font-medium">
          Teléfono
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={`mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="+56 9 1234 5678"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </label>

        <label className="block mb-1 mt-4 text-gray-700 dark:text-gray-300 font-medium">
          Mensaje
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y ${
              errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            rows={4}
            placeholder="Escribe tu mensaje aquí..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </label>

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
