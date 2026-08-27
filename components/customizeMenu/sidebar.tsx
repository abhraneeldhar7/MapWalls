import { Sidebar, SidebarContent } from "../ui/sidebar";
import { HexColorPicker } from "react-colorful";


export default function CustomizeSidebar() {
    return (<Sidebar variant="floating">
        <SidebarContent>
            ad
            <HexColorPicker />
        </SidebarContent>
    </Sidebar>)
}