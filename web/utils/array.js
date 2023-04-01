export function replicate(arr, times) {
    for (const parts = []; times > 0; times >>= 1) {
        if (times & 1)
            parts.push(arr);
        arr = arr.concat(arr);
    }
    return Array.prototype.concat.apply([], parts);
}
