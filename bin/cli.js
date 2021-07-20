#! /usr/bin/env node

const program = require('commander');
const createCommond = require('../commond/create');
// 定义命令和参数
program.command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // 打印执行结果
        createCommond(name, options)
    })
// 解析用户执行命令传入参数
program.parse(process.argv);