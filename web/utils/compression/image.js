function renderImage(canvas, blob) {
    return new Promise((resolve) => {
        const ctx = canvas.getContext('2d')
        const img = new Image();
        img.onload = (event) => {
            URL.revokeObjectURL(event.target.src) // 👈 This is important. If you are not using the blob, you should release it if you don't want to reuse it. It's good for memory.
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(event.target, 0, 0);
            resolve();
        }
        img.src = URL.createObjectURL(blob);
    })
}

export const compressImage = async (file) => {
    const canvas = document.querySelector("#compression-canvas");
    await renderImage(canvas, new Blob([file]));
    const dataUri = canvas.toDataURL("image/jpeg", 0.5);
    return fetch(dataUri)
        .then(res => res.blob())
        .then(blob => new File([blob], file.name, {
            type: "image/jpeg"
        }));
}