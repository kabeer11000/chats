import {createContext} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export const DeviceContext = createContext({
    isDesktop: false
});
export const DeviceProvider = ({children}) => {
    const matches = useMediaQuery('(min-width:600px)');
    return (
        <DeviceContext.Provider value={{
            isDesktop: matches
        }}>{children}</DeviceContext.Provider>
    )
}