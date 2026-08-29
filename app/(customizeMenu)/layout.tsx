import { MapProvider } from "@/components/providers/map-provider";
import { EditorProvider } from "@/components/providers/editor-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MapScreensLayout({ children }: { children: React.ReactNode }) {
  return <MapProvider>
    <EditorProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </EditorProvider>
  </MapProvider>
}