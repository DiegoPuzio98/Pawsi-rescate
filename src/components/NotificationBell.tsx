import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: string; // chat | post_deleted | system
  message: string;
  meta: any;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch inicial
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      const filtered = data?.filter(
        (n: any) => n.meta?.recipient_id === user.id
      );

      setNotifications(filtered || []);
    };

    fetchNotifications();

    // Realtime
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const n = payload.new as Notification;
          if (n.meta?.recipient_id === user.id) {
            setNotifications((prev) => [n, ...prev]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Marcar como leída al abrir
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);

    if (unread.length === 0) return;

    const ids = unread.map((n) => n.id);

    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const handleClickNotification = (n: Notification) => {
    if (n.type === "chat" && n.meta?.chat_id) {
      navigate(`/messages?chat=${n.meta.chat_id}`);
    }

    if (n.type === "post_deleted" && n.meta?.post_id) {
      navigate("/dashboard");
    }

    if (n.type === "system") {
      // no hace falta navegar
    }

    setOpen(false);
  };

  if (!user) return null; // No mostrar si no está logueado

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) markAllAsRead();
      }}
    >
      <PopoverTrigger className="relative">
        <Bell className="h-6 w-6 text-primary cursor-pointer" />

        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 bg-red-600 text-white px-1 py-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0">
        <div className="p-3 font-semibold border-b">Notificaciones</div>

        <ScrollArea className="max-h-64">
          <div className="flex flex-col divide-y">
            {notifications.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No tienes notificaciones
              </div>
            )}

            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClickNotification(n)}
                className={`text-left p-3 hover:bg-accent transition ${
                  !n.read ? "bg-accent/40" : ""
                }`}
              >
                <div className="font-medium text-sm">{n.message}</div>
                <div className="text-xs opacity-60">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

