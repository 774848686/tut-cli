const utils = require('../utils/index');
const chalk = require('chalk');
const ora = require('ora');
module.exports = function releaseCode(text){
    const spinner = ora('🗃 开始提交代码...').start();
    utils.pusBranch(text);
    spinner.succeed('🎉 代码提交完成');
}