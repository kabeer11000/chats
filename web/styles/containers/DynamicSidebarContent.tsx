import {DrawerContext} from "../../Contexts";
import {useContext} from "react";

export default function DynamicSidebarContent({children}) {
    const {isDesktop, drawerWidth} = useContext(DrawerContext);
    return  (
        <div style={{width: isDesktop ? `calc(100vw - ${drawerWidth}px)` : '100%', marginLeft: isDesktop ? drawerWidth : 0}}>{children}</div>
    )
}