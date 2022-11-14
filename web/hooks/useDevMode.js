export default function useDevMode() {
    return !!localStorage.getItem("kn.chats.devmode");
}