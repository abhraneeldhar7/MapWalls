import { SidebarProvider } from "@/components/ui/sidebar";

export default function MapScreensLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
