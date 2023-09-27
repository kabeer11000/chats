import ColorThief from 'colorthief';
export const getDominantColor = (image: string) => new Promise((resolve) => {
    const img = new Image();
    const colorThief = new ColorThief();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        if (img.complete) {
            console.log(colorThief)
            resolve(colorThief.getColor(img));
        }
    }
    img.src = image;
});
export const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')