"use client";

import CustomizeSidebar from "@/components/customizeMenu/sidebar";
import { MapView } from "@/components/map/map-view";
import { useMapProvider } from "@/components/providers/map-provider";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const { styles } = useMapProvider();
  const isMobile = useIsMobile();

  return (
    <main className="relative h-dvh w-full overflow-hidden relative">
      {!isMobile &&
        <CustomizeSidebar />
      }
      <MapView />
      {!isMobile && process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" &&
        <Sidebar className="w-[300px]" variant="inset" side="right">
          <SidebarContent>
            <pre className="whitespace-pre-wrap break-words px-2 text-sm leading-relaxed text-sidebar-foreground">
              {JSON.stringify(styles, null, 2)}
            </pre>
          </SidebarContent>
        </Sidebar>
      }
    </main>
  );
}