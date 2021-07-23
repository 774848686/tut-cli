const utils = require('../utils');
const chalk = require('chalk');
const ora = require('ora');
module.exports = function releaseCode(text){
    const spinner = ora('🗃 开始提交模板...').start();
    utils.pusBranch(text);
    spinner.succeed('🎉 模版提交完成');
}