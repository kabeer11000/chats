const fs = require("fs/promises");
const {join} = require("path");

const deepReadDir = async (dirPath) => await Promise.all((await fs.readdir(dirPath, {withFileTypes: true})).map(async (dirent) => {
    const path = join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
}))
// fs.writeFile(path.)
deepReadDir(join(__dirname, "./build")).then(console.log)