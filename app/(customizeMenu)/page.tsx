"use client";

import CustomizeSidebar from "@/components/customizeMenu/sidebar";
import { EditorScreen } from "@/components/editor/editor-screen";
import { MapView } from "@/components/map/map-view";
import SearchBar from "@/components/map/searchBar";
import { useEditor } from "@/components/providers/editor-provider";
import { useMapProvider } from "@/components/providers/map-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const showDebug = false

export default function Home() {
  const { styles, viewState } = useMapProvider();
  const { editorState, setEditorState, setFocusedElement } = useEditor();
  const isMobile = useIsMobile();
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      {!isMobile &&
        <div className="relative">
          <CustomizeSidebar />
          {/* <SidebarRail className=""/> */}
        </div>
      }

      <div className="fixed z-5 top-0 w-full p-4 flex items-center justify-between">
        <div />
        <div className={`transition-all ease-out ${editorState === "editor" ? "translate-y-[-100%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
          <SearchBar />
        </div>

        {editorState === "editor" ? <Button>Export</Button> :
          <Button onClick={() => { setFocusedElement(null); setEditorState("editor"); }}>Create</Button>}
      </div>

      {editorState === "editor" ? <EditorScreen /> : <MapView />}


      {showDebug && !isMobile && process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" &&
        <Sidebar className="w-[300px]" variant="inset" side="right">
          <SidebarContent className="p-2">
            <Label>View state</Label>
            <pre className="whitespace-pre-wrap break-words px-2 text-sm leading-relaxed text-sidebar-foreground">
              {JSON.stringify(viewState, null, 2)}
            </pre>
            <Label className="mt-5">Styles</Label>
            <pre className="whitespace-pre-wrap break-words px-2 text-sm leading-relaxed text-sidebar-foreground ">
              {JSON.stringify(styles, null, 2)}
            </pre>
          </SidebarContent>
        </Sidebar>
      }
    </main>
  );
}
