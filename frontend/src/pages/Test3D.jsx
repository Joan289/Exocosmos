import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { starFormSchema } from "../schemas/starFormSchema";

import FloatingFormPanel from "../components/ui/FloatingFormPanel";
import StarForm from "../components/forms/StarForm";
import LiveStar3DPreview from "../components/3d/LiveStar3DPreview";

// 🧠 Importa stats.js
import Stats from "stats.js";

export default function Test3D() {
  const [showComparison, setShowComparison] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const statsRef = useRef(null); // 📦 Referencia para stats.js

  const methods = useForm({
    resolver: zodResolver(starFormSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  // 🔧 Inicializar datos simulados
  useEffect(() => {
    const mockStar = {
      name: "Estrella Test",
      description: "Una estrella generada localmente.",
      mass_solar: 1,
      radius_solar: 1,
      thumbnail_url: "",
    };
    setInitialData(mockStar);
    methods.reset(mockStar);
  }, [methods]);

  // 🚀 Inicializar stats.js una sola vez
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0 = FPS
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.left = "0px";
    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    let animationFrameId;

    const update = () => {
      stats.begin();
      // Aquí no necesitas lógica, solo medir frame
      stats.end();
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stats.dom && stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
    };
  }, []);

  const handleSubmit = (data) => {
    console.log("🧪 Datos del formulario:", data);
  };

  if (!initialData)
    return <p className="text-white p-4">Inicialitzant estrella...</p>;

  return (
    <FormProvider {...methods}>
      <div className="relative w-screen h-screen overflow-hidden">
        <button
          onClick={() => setShowComparison((v) => !v)}
          className="absolute top-4 right-4 z-40 px-4 py-2 rounded-md bg-white/20 backdrop-blur text-sm text-white hover:bg-white/30 transition"
        >
          {showComparison
            ? "Ocultar Sol de comparació"
            : "Mostrar Sol de comparació"}
        </button>

        <button
          onClick={() => setBloomEnabled((prev) => !prev)}
          className="absolute top-4 right-60 z-40 px-4 py-2 rounded-md bg-white/20 backdrop-blur text-sm text-white hover:bg-white/30 transition"
        >
          {bloomEnabled
            ? "Desactivar Post-Processat"
            : "Activar Post-Processat"}
        </button>

        <LiveStar3DPreview
          showComparison={showComparison}
          bloomEnabled={bloomEnabled}
        />

        <FloatingFormPanel>
          <StarForm onSubmit={handleSubmit} />
        </FloatingFormPanel>
      </div>
    </FormProvider>
  );
}
