import create from "zustand";

export const usePlayerState = create<{
    playing: boolean,
    "playback.duration": number,
    "playback.played": number,
    "playback.loaded": number,
    updatePlaybackPlayed: (t: number) => void,
    updatePlaybackDuration: (t: number) => void,
    updatePlaybackLoaded: (t: number) => void,
    setPlaying: (t: boolean) => void,
}>((set) => ({
    playing: false,
    "playback.duration": 0,
    "playback.played": 0,
    "playback.loaded": 0,
    updatePlaybackPlayed: (t) => set({"playback.played": t}),
    updatePlaybackDuration: (t) => set({"playback.duration": t}),
    updatePlaybackLoaded: (t) => set({"playback.loaded": t}),
    setPlaying: (t) => set({playing: t}),
}));
export const useVideo = create((set, get) => ({
    id: null,
    metadata: {
        liked: false
    },
    playable: {
        url: null
    },
    updateLikedState: (s?: boolean) => set(state => ({metadata: {...state.metadata, liked: s ?? !state.metadata.liked,}}))
}))