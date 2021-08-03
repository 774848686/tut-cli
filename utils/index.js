const path = require('path');
const ora = require('ora');
const {
    execSync,
} = require('child_process');

function getDir(name) {
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    return path.join(cwd, name)
}
// 提交代码
function pusBranch(text) {
    try {
        execSync(`git add . && git commit -m '${text}' && git push`);
    } catch (e) {
        console.log(e);
    }
}
// 执行plop命令创建组件
async function createComp(){
    try {
        execSync(`npx plop`);
    } catch (e) {
        console.log(e);
    }
}
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();

    try {
        // 执行传入方法 fn
        const result = await fn(...args);
        // 状态为修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        // 状态为修改为失败
        spinner.fail('Request failed, refetch ...')
    }
}
module.exports = {
    getDir,
    pusBranch,
    createComp,
    wrapLoading
}