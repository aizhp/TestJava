# 我的假期 - 开发文档

## 一、项目概述

**项目名称**：我的假期
**项目类型**：微信小程序
**定位**：个人假期与出差管理小助手，帮助用户记录年假/调休假使用情况、统计出差天数与报销费用，数据清晰明了。
**数据策略**：本地存储为主，云端同步为辅（手动触发）。

## 二、技术栈

- 框架：微信小程序原生框架（WXML/WXSS/JS）
- 存储：本地 `wx.setStorageSync` + 微信云开发（CloudBase，可选）
- 云能力：云函数 + 云数据库（按 openid 隔离）
- UI 风格：活泼可爱风（粉色 #FF6B9D + 蓝色 #5B8FF9 渐变）

## 三、目录结构

```
/workspace
├── app.js                       # 入口，初始化模拟数据 & 云开发
├── app.json                     # 全局配置 + tabBar
├── app.wxss                     # 全局样式
├── project.config.json          # 项目配置
├── sitemap.json
├── utils/
│   └── util.js                  # 工具函数（日期/计算/格式化）
├── cloudfunctions/              # 云函数目录
│   └── syncData/                # 数据同步云函数
├── images/                      # 图标资源
│   ├── tab/                     # tabBar 图标
│   ├── logo.png                 # 小程序图标
│   └── share.png                # 分享配图
└── pages/
    ├── index/                   # 首页仪表盘
    ├── vacation/
    │   ├── list                 # 假期记录列表
    │   └── add                  # 添加请假/调休
    ├── trip/
    │   ├── list                 # 出差记录列表
    │   ├── add                  # 添加出差
    │   └── detail               # 出差详情
    └── settings/
        └── index                # 我的/设置
```

## 四、数据结构

### 1. vacationRecords（假期记录）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| type | string | annual/compensatory/personal/sick/other |
| direction | string | in(获得) / out(使用) |
| days | number | 天数（支持0.5） |
| date | string | YYYY-MM-DD |
| remark | string | 备注 |
| createdAt | number | 创建时间戳 |

### 2. tripRecords（出差记录）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| name | string | 出差名称 |
| destination | string | 目的地 |
| startDate | string | 开始日期 |
| endDate | string | 结束日期 |
| days | number | 出差天数 |
| subsidy | number | 补贴金额 |
| expenses | number | 报销费用 |
| status | string | pending/submitted/reimbursed |
| remark | string | 备注 |
| createdAt | number | 创建时间戳 |

### 3. settings（设置）
| 字段 | 类型 | 说明 |
|------|------|------|
| annualLeaveTotal | number | 年假总天数 |
| subsidyPerDay | number | 每日补贴标准 |
| reminderDays | number | 剩余提醒天数 |

## 五、功能模块

### 模块1：首页仪表盘
- 问候语 + 日期 + 头像
- 假期余额卡片（年假/调休假，带进度条）
- 快捷操作（记请假/记出差）
- 出差统计（本月出差天数/补贴/报销）
- 待报销提醒
- 最近请假记录 + 最近出差记录

### 模块2：假期管理
- 余额汇总卡片
- Tab 筛选（全部/年假/调休/病假）
- 记录列表（彩色圆点分类）
- 添加请假/获得调休（方向切换）
- 删除记录

### 模块3：出差管理
- 统计汇总卡片（累计出差天数/补贴/报销）
- Tab 筛选（全部/待报销/已提交/已报销）
- 出差卡片列表
- 添加出差（自动算天数和补贴）
- 出差详情（报销状态切换、费用明细）
- 删除出差

### 模块4：设置
- 数据统计
- 年假总天数设置
- 每日补贴标准设置
- 云端同步（手动触发）
- 数据导出（敬请期待）
- 清除所有数据
- 关于

### 模块5：分享
- 分享给朋友
- 分享到朋友圈
- 复制链接

## 六、部署说明

### 本地运行
1. 打开微信开发者工具
2. 导入项目，目录选 `/workspace`
3. AppID 填写自己的（或测试号）
4. 即可预览

### 云开发接入（可选）
1. 在开发者工具中开通云开发，创建环境
2. 将环境ID填入 `app.js` 的 `wx.cloud.init`
3. 上传部署 `cloudfunctions/syncData` 云函数
4. 创建云数据库集合：`vacation_records`、`trip_records`、`user_settings`
5. 集合权限设为"仅创建者可读写"

### 发布
1. 在开发者工具点击"上传"
2. 填写版本号和描述
3. 在小程序后台提交审核

## 七、任务完成清单

- [x] 基础项目结构
- [x] 首页仪表盘 UI
- [x] 假期模块（列表/添加/删除）
- [x] 出差模块（列表/详情/添加/删除）
- [x] 设置页
- [x] 本地存储 + 模拟数据
- [x] 分享功能（朋友/朋友圈/复制链接）
- [x] 云端同步（手动触发，本地为主）
- [x] 小程序图标 + 分享配图（SVG 设计 + PNG 生成工具）
- [x] 代码审核与Bug修复（id类型、金额精度、状态栏适配、业务逻辑）
- [x] 功能完整性验证
- [x] 最终自检

## 八、图标与图片说明

小程序图标和分享配图以 SVG 形式提供设计稿，并提供浏览器端 PNG 生成工具：
- `images/logo.svg` - 小程序图标设计稿
- `images/share.svg` - 分享配图设计稿
- `images/generate-icons.html` - 在浏览器打开即可生成并下载 PNG

**使用方法**：用浏览器打开 `images/generate-icons.html`，点击按钮生成 PNG，下载后放入 `images/` 目录。
分享时若 `images/share.png` 不存在，小程序会自动使用页面截图，不影响功能。

## 九、云开发接入说明

1. 在 `app.js` 的 `globalData.cloudEnvId` 填写云开发环境ID
2. 在开发者工具中右键 `cloudfunctions/syncData` → 上传并部署
3. 在云开发控制台创建数据库集合 `user_data`，权限设为"仅创建者可读写"
4. 未配置时小程序正常使用本地功能，设置页会提示"未开启"
