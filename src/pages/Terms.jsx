import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";

const termsText = `
# Términos y Condiciones

Bienvenido a nuestra aplicación. Por favor, lee cuidadosamente los términos y condiciones antes de utilizar el servicio.

## Uso del Servicio

El usuario se compromete a utilizar el servicio conforme a las leyes y normas vigentes, sin causar daños o perjuicios a terceros.

## Propiedad Intelectual

Todos los contenidos, marcas y materiales aquí presentados son propiedad de la empresa y están protegidos por las leyes de propiedad intelectual.

## Responsabilidad

No nos hacemos responsables por daños directos o indirectos derivados del uso del servicio.

## Modificaciones

Nos reservamos el derecho de modificar estos términos en cualquier momento, notificando a los usuarios según corresponda.

... (Puedes agregar aquí más texto real o simulado para llenar)

`;

const modalAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export default function Terms({ onAccept }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        <FileText size={24} /> Términos y Condiciones
      </h2>

      <div className="border rounded p-4 max-h-48 overflow-y-auto text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
        {termsText}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setModalOpen(true)}
          className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 text-sm"
        >
          Leer términos completos
        </button>

        <button
          onClick={() => {
            if (onAccept) onAccept();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          aria-label="Aceptar términos y condiciones"
        >
          Aceptar
        </button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="terms-modal"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Términos y Condiciones Completos</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Cerrar modal términos"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm">
                {termsText}
              </pre>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
