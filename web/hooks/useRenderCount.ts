import React from "react";

export function useRenderCount() {
    const renderCount = React.useRef(1);
    React.useEffect(() => {
        renderCount.current += 1;
    });
    return renderCount;
}
