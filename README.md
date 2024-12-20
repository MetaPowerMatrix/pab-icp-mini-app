# 原力小镇前端App
- 构建一个AI驱动的在ICP网络上运行的社交应用
- 验证ICP网络运行社交应用的可行性
-[ Web App访问地址](https://tsoel-7yaaa-aaaai-alcva-cai.icp0.io/)

## Introduction
PartyBoard原力小镇项目的前端App代码，使用React + netx.js实现，聊天使用了websocket机制

Highlight some features:
- 话题社交。
- 和不同的AI角色聊天。
- 和不同的真人角色聊天。
 
![架构图](https://github.com/MetaPowerMatrix/pabOnICP/blob/master/MetaPowerICP%E6%9E%B6%E6%9E%84%E5%9B%BE.jpg)

## Installation

### Prerequisites
需要先安装ICP的开发工具

```bash
$ sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

### Install
下载和编译部署前端的步骤

```bash
$ git clone https://github.com/MetaPowerMatrix/pab-icp-mini-app
$ cd pab-icp-mini-app
$ dfx deploy --network ic
```
部署之前需要本地钱包中有足够的cycles

## Usage
部署完成之后，可以通过前端[url](https://tsoel-7yaaa-aaaai-alcva-cai.icp0.io/)访问canister的接口

### 接口访问例子

```bash
$ dfx canister call matrix hi
$ dfx canister call agent request_all_patos
```

## Documentation
PartyBoard原力小镇项目的前端App代码，使用React + netx.js实现，聊天使用了websocket机制

## ScreenShot
![Home](https://github.com/MetaPowerMatrix/pab-icp-mini-app/blob/master/screens/home.png)
![Splash](https://github.com/MetaPowerMatrix/pab-icp-mini-app/blob/master/screens/splash.png)
![topic](https://github.com/MetaPowerMatrix/pab-icp-mini-app/blob/master/screens/topic.png)
![chat](https://github.com/MetaPowerMatrix/pab-icp-mini-app/blob/master/screens/chat.png)
![profile](https://github.com/MetaPowerMatrix/pab-icp-mini-app/blob/master/screens/profile.png)


## Roadmap
Describe the project roadmap, this could be the grant milestones, but it could also be the team's broader project roadmap.

- [x] 移植Matrix和Agent服务，部署两个canister
- [x] 移植Pato智能体服务，部署一个canister 
- [x] 增加向量数据库使用，部署一个canister. 
- [x] 部署前端App到canister，可以通过canister域名访问应用的功能.
- [ ] 添加更多的系统AI角色.
- [ ] 构建数据量足够大的社交应用向量数据库供检索.

## License
This project is licensed under the MIT license, see LICENSE.md for details. See CONTRIBUTE.md for details about how to contribute to this project. 


## References
- [Internet Computer](https://internetcomputer.org)

