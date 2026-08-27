"use client";

import CustomizeSidebar from "@/components/customizeMenu/sidebar";
import { MapView } from "@/components/map/map-view";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <main className="relative h-dvh w-full overflow-hidden relative">
        <CustomizeSidebar />
        <MapView />
      </main>
    </SidebarProvider>
  );
}
