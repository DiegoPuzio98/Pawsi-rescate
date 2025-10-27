import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/paw-icon";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart,
  Home,
  Camera,
  AlertTriangle,
  ShoppingCart,
  Stethoscope,
  Phone,
  LogOut,
  User,
  Settings,
  Bookmark,
  MessageSquare
} from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDonatePanel, setShowDonatePanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, signOut, user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnread = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id")
        .eq("recipient_id", user.id)
        .is("read_at", null);
      setUnreadCount(data?.length || 0);
    };
    fetchUnread();

    const channel = supabase
      .channel("unread-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchUnread)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const menuItems = [
    { icon: Home, label: t("nav.home"), path: "/" },
    { icon: Camera, label: t("nav.reported"), path: "/reported" },
    { icon: AlertTriangle, label: t("nav.lost"), path: "/lost" },
    { icon: ShoppingCart, label: t("nav.marketplace"), path: "/marketplace" },
    { icon: Stethoscope, label: t("nav.veterinarians"), path: "/veterinarians" },
    { icon: Heart, label: t("nav.adoptions"), path: "/adoptions" },
    { icon: Phone, label: t("nav.support"), path: "/support" },
  ];

  const authMenuItems = [
    { icon: User, label: t("nav.dashboard"), path: "/dashboard" },
    { icon: MessageSquare, label: "Mensajes", path: "/messages", showBadge: true },
    { icon: Bookmark, label: t("nav.saved"), path: "/saved" },
    { icon: Settings, label: t("nav.profile"), path: "/profile" },
  ];

  if (user?.email === "ecomervix@gmail.com") {
    authMenuItems.push({ icon: Settings, label: "Panel Admin", path: "/admin" });
  }

  const alias = "Pawsiapp";
  const cbu = "0000003100049554063376";

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PawIcon size={32} />
          <span className="text-2xl font-bold text-primary">Pawsi</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link to="/auth">
              <Button variant="outline" size="sm">{t("auth.signIn")}</Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> {t("auth.signOut")}
            </Button>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>

            {/* ✅ Ajuste principal: el contenido usa flex-col con scroll opcional pero mostrando todo */}
            <SheetContent className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {isAuthenticated && (
                  <>
                    <hr className="my-2" />
                    {authMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          {item.showBadge && unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {unreadCount}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>

              {/* ✅ Muevo el botón de donación al final visible siempre */}
              {isAuthenticated && (
                <div className="mt-4 mb-4">
                  <button
                    onClick={() => setShowDonatePanel(!showDonatePanel)}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white font-medium rounded-full w-full hover:bg-green-600 transition"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Apoyanos</span>
                  </button>

                  {showDonatePanel && (
                    <div className="bg-white rounded-xl p-4 shadow mt-2 border border-green-200 flex flex-col gap-2">
                      <p className="mb-1 font-medium text-sm">
                        Si querés apoyarnos, podés donar por transferencia:
                      </p>

                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="font-mono">{alias}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(alias);
                            alert("¡Alias copiado al portapapeles!");
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        >
                          Copiar
                        </button>
                      </div>

                      <p className="mb-1 font-medium text-sm">
                        O también podés donar por <strong>CBU:</strong>
                      </p>

                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="font-mono">{cbu}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cbu);
                            alert("¡CBU copiado al portapapeles!");
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                        >
                          Copiar
                        </button>
                      </div>

                      <p className="text-sm text-gray-600">
                        Cualquier aporte nos ayuda a seguir creciendo y mejorar
                        Pawsi. ¡Muchas gracias por tu apoyo!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};





