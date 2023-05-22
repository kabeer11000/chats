import {useMemo} from "react";

export function useVisibilityChange(serverFallback) {
    const getServerSnapshot = () => serverFallback;
    const [getSnapshot, subscribe] = useMemo(() => {
        return [
            () => document.visibilityState === 'visible',
            (notify) => {
                window.addEventListener('visibilitychange', notify);

                return () => {
                    window.removeEventListener('visibilitychange', notify);
                };
            },
        ];
    }, []);
}