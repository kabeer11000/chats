import useResizeObserver from '@react-hook/resize-observer'
import {useLayoutEffect, useState} from "react";

const useSize = (target) => {
    const [size, setSize] = useState()

    useLayoutEffect(() => {
        setSize(target.current.getBoundingClientRect())
    }, [target])

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
}
export default useSize;