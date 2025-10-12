
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { NotificationsView } from "@/components/dashboard/notifications-view";
import type { AppNotification } from "@/types";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const markNotificationAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <PEMSDashboard initialRole={null}>
            <NotificationsView 
                notifications={notifications} 
                onMarkAsRead={markNotificationAsRead}
            />
        </PEMSDashboard>
    );
}
