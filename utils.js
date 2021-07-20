const path = require('path');
function getDir(name) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    return path.join(cwd, name)
}
module.exports = {
    getDir
}