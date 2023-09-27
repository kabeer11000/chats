import {atom, selector} from "recoil";

export type IDrawerTypes = "permanent" | "temporary"
export const DrawerAtom = atom({
    key: 'drawer',
    default: {
        open: false,
        type: "permanent",
        isDesktop: false,
        width: 340,
    }
});
export const DrawerOpenToggle = selector({
    key: 'drawer.open.toggler',
    get: ({get}) => get(DrawerAtom).open,
    set: ({set}, explicit: boolean | undefined) => set(DrawerAtom, (prevValue => ({...prevValue, open: explicit === undefined ? !prevValue.open : explicit})))
});
export const DrawerTypeToggle = selector({
    key: 'drawer.type.toggler',
    get: ({get}) => get(DrawerAtom).type,
    set: ({set}, type: IDrawerTypes) => set(DrawerAtom, (prevValue => ({...prevValue, type})))
});