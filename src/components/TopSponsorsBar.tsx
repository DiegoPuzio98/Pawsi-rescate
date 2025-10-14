import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
}

export const TopSponsorsBar = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  console.log("✅ TopSponsorsBar montado");

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      console.log("🎯 Datos recibidos desde Supabase:", data, error);

      if (error) {
        console.error("Error fetching sponsors:", error);
      } else {
        setSponsors(data || []);
      }
    };

    fetchSponsors();
  }, []);

  return (
    <div className="w-full bg-background border-t border-border overflow-hidden py-6">
      {/* Título estilizado */}
      <div
        className="flex justify-center py-3 text-xl font-bold text-brown tracking-wider drop-shadow-md"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        NOS APOYAN
      </div>

      {/* Carrusel automático */}
      <div className="overflow-hidden whitespace-nowrap">
        <div
          className="inline-flex animate-scroll gap-8 px-4"
          style={{
            animation: "scroll 30s linear infinite",
          }}
        >
          {sponsors.length > 0
            ? sponsors.concat(sponsors).map((sponsor, idx) => (
                <img
                  key={idx}
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition"
                  loading="lazy"
                />
              ))
            : // Placeholder mientras cargan
              <div className="h-12 w-full flex items-center justify-center text-muted-foreground opacity-50">
                Cargando...
              </div>}
        </div>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};










