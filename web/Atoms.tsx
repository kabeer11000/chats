import {atom} from "recoil";
import useMediaQuery from "@mui/material/useMediaQuery";

export const InstallPromptAtom = atom({
    key: 'kn.atom.installation-prompt',
    default: {
        event: null,
        open: false,
    }
});
