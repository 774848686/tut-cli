const path = require('path');
const {
    execSync
} = require('child_process');

function getDir(name) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    return path.join(cwd, name)
}

function pusBranch(text) {
    try {
        execSync(`git add . && git commit -m '${text}' && git push`);
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    getDir,
    pusBranch
}