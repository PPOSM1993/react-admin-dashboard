export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Política de Privacidad
      </h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        En nuestra empresa valoramos tu privacidad y nos comprometemos a proteger tus datos personales.
        Esta política describe cómo recopilamos, usamos y protegemos tu información.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        Información que recopilamos
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Recopilamos información personal que nos proporcionas directamente, como tu nombre, correo electrónico y datos de contacto.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        Uso de la información
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Utilizamos tu información para responder a tus consultas, mejorar nuestros servicios y enviarte comunicaciones relevantes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        Seguridad de los datos
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, alteración o divulgación.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        Derechos del usuario
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Puedes solicitar acceso, rectificación o eliminación de tus datos personales en cualquier momento contactándonos.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
        Cambios en esta política
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Nos reservamos el derecho de modificar esta política cuando sea necesario. Te notificaremos sobre cambios significativos.
      </p>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Última actualización: 25 de junio de 2025
      </p>

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
