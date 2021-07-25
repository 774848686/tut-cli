#! /usr/bin/env node
const program = require('commander');
const createCommond = require('../commond/create');
const releaseCode = require('../commond/release');
const figlet = require('figlet');
// 定义命令和参数
program.command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // 打印执行结果
        createCommond(name, options)
    })
program
    .command('releaseCo <commit-text>')
    .description('发布代码')
    .action(function (text,options) {
        releaseCode(text);
        console.log('\r\n' + figlet.textSync('NO BUG', {
            font: 'eftiwall',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
          }));
    });
// 解析用户执行命令传入参数
program.parse(process.argv);