import { MapProvider } from "@/components/providers/map-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MapScreensLayout({ children }: { children: React.ReactNode }) {
  return <MapProvider>
    <SidebarProvider>
      {children}
    </SidebarProvider>
  </MapProvider>
}