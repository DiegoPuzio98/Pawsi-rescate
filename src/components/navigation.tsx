import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { PawIcon } from "@/components/ui/paw-icon";
import { NotificationBell } from "@/components/NotificationBell";   // ✅ AGREGADO
import { supabase } from "@/integrations/supabase/client";
import {
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
  MessageSquare,
  Menu as MenuIcon
} from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    {
      icon: () => (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-6-4.35-9-8.5A6 6 0 0 1 6 3c2.1 0 3.5 1.2 3.9 2.1C10.5 4.2 11.9 3 14 3a6 6 0 0 1 3 11.5C18 16.65 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: t("nav.adoptions"),
      path: "/adoptions"
    },
    { icon: Phone, label: t("nav.support"), path: "/support" }
  ];

  const authMenuItems = [
    { icon: User, label: t("nav.dashboard"), path: "/dashboard" },
    { icon: MessageSquare, label: "Mensajes", path: "/messages", showBadge: true },
    { icon: Bookmark, label: t("nav.saved"), path: "/saved" },
    { icon: Settings, label: t("nav.profile"), path: "/profile" }
  ];

  if (user?.email === "ecomervix@gmail.com") {
    authMenuItems.push({ icon: Settings, label: "Panel Admin", path: "/admin" });
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PawIcon size={32} />
          <span className="text-2xl font-bold text-primary">Pawsi</span>
        </Link>

        <div className="flex items-center gap-2">

          {/* ✅ CAMPANITA DE NOTIFICACIONES (FUNCIONAL) */}
         {/* <NotificationBell /> */}

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
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <div
                className="h-full overflow-y-auto pr-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}
              >
                <div className="flex flex-col gap-4 mt-8 pb-20 px-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        }`}
                      >
                        {typeof Icon === "function" ? (
                          <Icon className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};






