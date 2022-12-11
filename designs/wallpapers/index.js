const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs/promises');
const url = require('url');
const path = require('path');
const crypto = require('crypto');
const CreateWallpaperHTMLCache = async () => fetch('https://www.proper-cooking.info/hipster-pattern-wallpaper').then(res => res.text()).then(async text => {
    await fs.writeFile('./wallpapers-web.html', text);
});
fs.readFile('./wallpapers-web.html').then(async buffer => {
    const text = buffer.toString();
    const index = await fs.readFile('./index.json').then(buffer => JSON.parse(buffer.toString()));
    const $ = cheerio.load(text);
    const images = Array.from($('body > main > div:nth-child(2) > div.row > div.ads > a > picture > img')).slice(0, 50);
    for (const el of images) {
        const image = $(el).attr('src');
        const hash = crypto.createHash('md5').update(image).digest('hex');
        await fs.writeFile(`./images/${hash}${path.extname(url.parse(image).pathname)}`, Buffer.from(await fetch(image).then(res => res.arrayBuffer())));
        index[hash] = {cached: !!1, d: Date.now(), name: `${hash}${path.extname(url.parse(image).pathname)}`};
    }
    await fs.writeFile("./index.json", JSON.stringify(index));
})