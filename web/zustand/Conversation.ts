import create from "zustand";
import {v4} from "uuid";
import {Dispatch, SetStateAction} from "react";

export interface IActionBackdropState {
    open: boolean,
    task: null | {
        id: string
    },
    state: {
        error: boolean
    },
    destroy: () => void,
    toggle: () => void,
    create: () => void,
    error: () => void,

    [x: string]: any
}

export const useActionBackdrop = create<IActionBackdropState>((set, get) => ({
    open: false,
    state: {
        error: false,
    },
    task: null,
    create: (open = true) => set({open: open, task: {id: v4()}}),
    destroy: () => set({open: false, task: null}),
    toggle: () => set({open: !get().open}),
    error: () => set(({state: {error: true}})),
}))

export interface _IInputProps {
    text: string,
    inputFocused: boolean,
    setInputFocused: Dispatch<SetStateAction<boolean>>,
    voiceMessage: {
        sheetOpen: boolean,
        toggleSheet: () => void,
    },
    files: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>,
    setText: Dispatch<SetStateAction<string>>,
    setFiles: Dispatch<SetStateAction<Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>>>,

    [x: string]: any
}

export interface IInputProps {
    state: {
        text: null | string,
        files: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>,
        focused: boolean,
    },
    setText: (x: string) => void,
    setFiles: (x: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>) => void,
    setFocus: (x: boolean) => void,
}

export const useInput = create<IInputProps>((set) => ({
    state: {
        text: null,
        files: [],
        focused: true
    },
    setText: (x: string) => set(state => ({state: {...state.state, text: x}})),
    setFiles: (x: Array<{ url: string, type: "kn.chats.IMAGE" | "kn.chats.AUDIO" }>) => set(state => ({
        state: {
            ...state.state,
            files: x
        }
    })),
    setFocus: (x: boolean) => set(state => ({state: {...state.state, focused: x}})),
}));
