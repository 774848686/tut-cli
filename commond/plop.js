const utils = require('../utils/index');
const chalk = require('chalk');
const ora = require('ora');
module.exports = async function createComp(){
    const spinner = ora('🗃 开始创建组件...').start();
    let data = await utils.createComp();
    if(data){
        spinner.succeed('🎉 组件创建完成');
    }else{
        spinner.fail('😭 组件创建失败')
    }
}