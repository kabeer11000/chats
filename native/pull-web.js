const fs = require('fs/promises');
const { exec } = require('child_process');
function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout)
            });
        })
    }
}
async function main() {
    const os = new os_func();
    await os.execCommand('/bin/zsh ./scripts/pull.sh');
    fs.l
}