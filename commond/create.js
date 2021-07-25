const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const utils = require('../utils/index');
const Generator = require('./Generator');
module.exports = async function (name, options) {
    let targetDir = utils.getDir(name);
    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            let {
                action
            } =
            await inquirer.prompt([{
                name: 'action',
                name: 'action',
                type: 'list',
                message: 'Target directory already exists Pick an action:',
                choices: [{
                    name: 'Overwrite',
                    value: 'overwrite'
                }, {
                    name: 'Cancel',
                    value: false
                }]
            }])
            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir)
            }
        }
    }
    // 创建一个文件夹
     // 创建项目
     const generator = new Generator(name, targetDir);

     // 开始创建项目
     generator.create()

}