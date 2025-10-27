import { useEffect } from "react";

interface DonateButtonProps {
  open: boolean;
  onClose: () => void;
}

export const DonateButton = ({ open, onClose }: DonateButtonProps) => {
  const alias = "Pawsiapp";

  const handleCopy = () => {
    navigator.clipboard.writeText(alias);
    alert("¡Alias copiado al portapapeles!");
  };

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] overflow-auto p-4">
      {/* Fondo oscuro semi-transparente */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose} // click en fondo cierra modal
      />
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full shadow-xl z-[101] animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-3 text-center text-green-600">
          Apoyá a Pawsi
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          Pawsi es una app dedicada al bienestar y la solidaridad con los animales. Cada donación nos ayuda a seguir desarrollando nuevas funciones y mejorar la experiencia para todos los usuarios.
        </p>
        <p className="mb-2 font-medium">
          Si querés apoyarnos, podés donar por transferencia a este alias de Mercado Pago:
        </p>
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-4">
          <span className="font-mono">{alias}</span>
          <button
            onClick={handleCopy}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
          >
            Copiar
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Cualquier aporte nos ayuda a seguir creciendo y mejorar Pawsi. ¡Muchas gracias por tu apoyo!
        </p>
      </div>
    </div>
  );
};




