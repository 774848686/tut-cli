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
一. 安装依赖
```
npm install commander
``` 
二. 自定义一个`tut-cli create app-name`命令：
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

三. 使用`inquirer`与开发者进行交互.我们想要跟`vue-cli`那样，创建一个项目目录的时候，需要检查该项目是否已经存在；
1. 首先我们是要进行检测项目是否存在，使用node中的fs模块如下代码：
```
const fs = require('fs-extra');
const program = require('commander');
const path = require('path');
program.command(`create <app-name>`)
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
       .option('-f, --force', 'overwrite target directory if it exist')
       .action((name, options) => {
        // 获取待创建的app名称
        const targetDir = path.join(process.cwd(),name)
        if(fs.existsSync(targetDir)){
            // 这块就是询问开发者是否要进行覆盖或者不覆盖
        }
        // 不存在，则需要创建该目录
        console.log('name',name)
    })
// 注意最后需要解析一下参数
program.parse(process.argv);
```
2. 我们实现一下询问开发者是否要进行覆盖文件功能；
这就用到我们的`inquirer`工具库，做一个选择列表，具体使用如下：
```
const inquirer = require('inquirer');
// inquirer 返回的是一个promise，所以我们可以用await进行操作；
let {action} = await inquirer.prompt([
    {
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
    }
]);
console.log('action',action)
```
这样我们就可以拿到这个开发者选择的结果了。如果是选择覆盖，那么我们使用`fs.remove('dirpath')`即可。完善的逻辑如下：
```

const fs = require('fs-extra');
const program = require('commander');
const path = require('path');
const inquirer = require('inquirer');
program.command(`create <app-name>`)
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // 获取待创建的app名称
        const targetDir = path.join(process.cwd(), name)
        if (fs.existsSync(targetDir)) {
            // 这块就是询问开发者是否要进行覆盖或者不覆盖
            let {
                action
            } = await inquirer.prompt([{
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
            }]);
            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir);
                // 创建一个文件夹
                // 创建项目
                // 开始创建项目
            }

        }
        // 不存在，则需要创建该目录
        console.log('name', name)
    })
// 注意最后需要解析一下参数
program.parse(process.argv);
```
四、拉取远程仓库代码，本地项目下载
1. 如何获取远程仓库信息
`github`提供了一个api可以进行远程仓库的读取，我们可新建一个`organization`;然后新增两个模版项目；通过`https://api.github.com/orgs/tut-templates/repos`即可获取所有的远程仓库信息；如果我们有多个tag，我们还可进行`https://api.github.com/repos/tut-templates/${repo}/tags`获取。
2. 远程仓库的下载
使用`download-git-repo`工具库，进行本地下载，使用方法如下：
```
download('仓库地址', '下载地址', function (err) {
  console.log(err ? 'Error' : 'Success')
})
```
我们这里为了进行`promise`化，使用`util.promisify(downloadGitRepo)`；如下：

```
const downloadGitRepo = require('download-git-repo'); // 不支持 Promise
this.downloadGitRepo = util.promisify(downloadGitRepo);
 // 1）拼接下载地址
        const requestUrl = `tut-templates/${repo}${tag?'#'+tag:'#main'}`;

        // 2）调用下载方法 wrapLoading 是我们封装的loading工具方法
      await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置
```
五、添加用户选择交互逻辑
通过上面我们已经知道了如何去获取远程仓库以及如何下载他们。为了让开发者根据自己的需求来进行选择下载，我们再次使用`inquirer`:

```
     // 1）从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
        if (!repoList) return;

        // 过滤我们需要的模板名称
        const repos = repoList.map(item => item.name);

        // 2）用户选择自己新下载的模板名称
        const {
            repo
        } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'Please choose a template to create project'
        })

        // 3）return 用户选择的名称
        return repo;
```
#### plop工具库的使用
我们每次在做`vue`项目的时候，经常会新建一些组件。我们的流程是一个一个的文件目录创建，这样其实比较浪费时间；于是我们可使用这个`plop`工具库，命令时创建组件。
- 创建模版文件
```
├─plop-templates //  plop自定义模版目录
|   ├── component.scss.hbs // scss模版
|   ├── component.vue.hbs // vue模版
|   └─— README.md.hbs // README组件说明文档
```
- plop 配置文件 `plopfile.js`
```
const utils = require('./utils');
const {resolve} = require('path')
console.log('__dirname : '+ resolve('./'),resolve(__dirname))
module.exports = plop => {
    plop.setGenerator('component', {
        // 描述
        description: 'create a component',
        // 询问组件的名称
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'Your component name',
            default: 'MyComponent'
        }],
        // 获取到回答内容后续的动作
        actions: [
            //每一个对象都是一个动作
            {
                type: 'add', // 代表添加文件
                // 被创建文件的路径及名称
                // name 为用户输入的结果，使用 {{}} 使用变量
                // properCase: plop 自带方法，将 name 转换为大驼峰
                path: `${ process.cwd()}/src/components/{{ properCase name }}/index.vue`,
                // 模板文件地址
                templateFile: 'plop-templates/component.vue.hbs'
            },
            {
                type: 'add',
                path: `${ process.cwd()}/src/components/{{ properCase name }}/index.scss`,
                templateFile: 'plop-templates/component.scss.hbs'
            },
            {
                type: 'add',
                path: `${ process.cwd()}/src/components/{{ properCase name }}/README.md`,
                templateFile: 'plop-templates/README.md.hbs'
            }
        ]

    })
}
```
- 使用直接在要添加的目录终端输入`npx plop`即可

#### 为了使项目结构清晰，我们调整项目结构

```
├─bin // 脚手架命令启动入口文件
├─commond // 命令的实现逻辑
|   ├── create.js // 对项目的文件是否存在进行检测以及创建
|   ├── Generator.js // 项目的下载以及远程请求
|   └─— release.js // 提交git的逻辑
├─utils // 工具方法的封装
└─package.json
```








