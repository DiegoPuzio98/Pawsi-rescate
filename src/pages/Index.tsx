import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { NewsStrip } from "@/components/news-strip";
import { Camera, AlertTriangle, Heart, ShoppingCart, Stethoscope, Search } from "lucide-react";
import { PawIcon } from "@/components/ui/paw-icon";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TopSponsorsBar } from "@/components/TopSponsorsBar";
import { DonateButton } from "@/components/DonateButton";
import { supabase } from "@/integrations/supabase/client"; // ✅ IMPORTANTE

const Index = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("reported");
  const [donateOpen, setDonateOpen] = useState(false);
  const [missingLocation, setMissingLocation] = useState(false);

  // ✅ Detectar país/provincia faltantes desde la tabla profiles
  useEffect(() => {
    let mounted = true;

    const checkProfileLocation = async () => {
      if (!isAuthenticated || !user) {
        if (mounted) setMissingLocation(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("country, province")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("Error fetching profile for index:", error);
          if (mounted) setMissingLocation(true);
          return;
        }

        const country = typeof data?.country === "string" ? data.country.trim() : "";
        const province = typeof data?.province === "string" ? data.province.trim() : "";

        if (mounted) setMissingLocation(!country || !province);
      } catch (err) {
        console.error("checkProfileLocation error:", err);
        if (mounted) setMissingLocation(true);
      }
    };

    checkProfileLocation();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user]);

  const handleSearch = () => {
    if (!q) navigate(`/${category}`);
    else navigate(`/${category}?q=${encodeURIComponent(q)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {/* ✅ ALERTA SI FALTA PAÍS O PROVINCIA */}
        {missingLocation && (
          <div className="mb-6 bg-yellow-100 border border-yellow-300 px-6 py-3 rounded-xl shadow-sm">
            <p className="text-base font-medium text-center text-gray-800">
              Para ver contenido debes seleccionar país y provincia.
            </p>
            <div className="flex justify-center mt-2">
              <Button onClick={() => navigate("/profile")}>Completar perfil</Button>
            </div>
          </div>
        )}

        {/* MENSAJE SI NO HAY SESIÓN */}
        {!isAuthenticated && (
          <div className="mb-6 text-center text-gray-700 bg-yellow-100 border border-yellow-300 px-6 py-3 rounded-xl shadow-sm">
            <p className="text-base font-medium">Debes iniciar sesión para ver contenido.</p>
          </div>
        )}

        {/* HERO */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PawIcon size={64} />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t("home.welcome")}</h1>
          <p className="text-muted-foreground">{t("home.subtitle")}</p>
        </div>

        {/* GLOBAL SEARCH */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_120px] gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("action.search")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reported">{t("nav.reported")}</SelectItem>
                <SelectItem value="lost">{t("nav.lost")}</SelectItem>
                <SelectItem value="adoptions">{t("nav.adoptions")}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>Buscar</Button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{t("home.animalSighted")}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t("home.animalSightedDesc")}</p>
                <Button asChild className="w-full">
                  <Link to="/reported/new">{t("home.reportSighting")}</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{t("home.lostPet")}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t("home.lostPetDesc")}</p>
                <Button asChild variant="destructive" className="w-full">
                  <Link to="/lost/new">{t("home.postAlert")}</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* VIEW LISTINGS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to="/reported">
            <Button variant="secondary" className="w-full h-16 flex flex-col gap-1">
              <Camera className="h-5 w-5" />
              <span className="text-sm">{t("nav.reported")}</span>
            </Button>
          </Link>

          <Link to="/lost">
            <Button variant="secondary" className="w-full h-16 flex flex-col gap-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{t("nav.lost")}</span>
            </Button>
          </Link>
        </div>

        {/* OTHER SERVICES */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link to="/adoptions">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <Heart className="h-5 w-5" />
              <span className="text-sm">{t("home.adoptions")}</span>
            </Button>
          </Link>

          <Link to="/marketplace">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">{t("home.buySell")}</span>
            </Button>
          </Link>

          <Link to="/veterinarians">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <Stethoscope className="h-5 w-5" />
              <span className="text-sm">{t("nav.veterinarians")}</span>
            </Button>
          </Link>
        </div>

        <NewsStrip />

        {/* DONACIONES */}
        <div className="flex justify-center mt-6 mb-8">
          <Button onClick={() => setDonateOpen(true)} className="px-6 py-2">
            Colaborar con Pawsi 💚
          </Button>
        </div>

        <DonateButton open={donateOpen} onClose={() => setDonateOpen(false)} />
      </main>

      <TopSponsorsBar />
    </div>
  );
};

export default Index;

