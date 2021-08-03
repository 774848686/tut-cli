### 如何构建一个工作中通用的业务脚手架

#### 需求背景
每次开发一个项目时候我们都会找一个项目模版，然后拉取代码进行coding。这个流程会比较繁琐，看到vue的脚手架在初始化的时候就做了一些远程模版拉取的操作；于是就有了本次的需求，做一个`tut-cli`.
#### 需求分析
`tut-cli`的主要功能有：
1. 拉取模版的功能
2. 提交代码
3. 可通过命令创建vue模版
#### 准备工作
- 初始化项目
```
mkdir tut-cli
cd tut-cli
npm init
```
#### 创建启动命令
1. 第一步我们创建一个脚手架启动文件`cli.js`,
```
mkdir bin 
cd bin
touch cli.js
```
注意这个js文件需要添加上
```
#! /usr/bin/env node
// Node CLI 应用入口文件必须要有这样的文件头
console.log('start')
```
2. 在`package.json`中添加脚手架指定解析文件
```
{
    "name": "tut-cli",
    ...
    "bin": "./bin/cli.js",
    ...
}
```
可执行测试一下，输入命令`tut-cli`,如果能在终端输出`start`，我们便完成了脚手架的第一步骤。
#### commander自定义命令
- 我们在使用`vue-cli`创建项目的时候，会自动创建一个项目目录，然后拉取对应的模版代码；我们就按照这个思路去写一个自定义命令。
1. 安装依赖
```
npm install commander
``` 
1. 自定义一个`tut-cli create app-name`命令：
```
// /bin/cli.js
const program = require('commander');
program.command(`create <app-name>`)
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
       .option('-f, --force', 'overwrite target directory if it exist')
       .action((name, options) => {
        // 获取待创建的app名称
        console.log('name',name)
    })
// 注意最后需要解析一下参数
program.parse(process.argv);
```
在终端运行`tut-cli create my-app`,这时候终端就会输出`name,my-app`


