const fs = require("fs/promises");
const {join} = require("path");
const os = require("os");
export default async (req, res) => {
    return res.json(os.networkInterfaces()['en0'].find(({family}) => family.toLowerCase() === 'ipv4')['address']);
    const deepReadDir = async (dirPath) => await Promise.all((await fs.readdir(dirPath, {withFileTypes: true})).map(async (dirent) => {
        const path = join(dirPath, dirent.name)
        return dirent.isDirectory() ? await deepReadDir(path) : path
    }))
    res.json({__dirname: join(__dirname, '../../../'), files: []})
}
// [...await deepReadDir(join(__dirname, '../../../static/chunks'))]