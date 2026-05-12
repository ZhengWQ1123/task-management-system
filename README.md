# 任务管理系统

一个轻量级的个人任务管理系统，帮助用户高效管理日常任务。

## 功能特性

- ✅ **任务管理**: 添加、编辑、删除任务
- 🔄 **状态切换**: 支持待处理、进行中、已完成三种状态
- 🎯 **优先级标记**: 高、中、低三种优先级
- 🔍 **搜索过滤**: 支持按关键词、状态、优先级筛选
- 📊 **数据统计**: 实时展示任务统计信息

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式框架**: TailwindCSS 3
- **图标库**: Lucide React
- **数据模拟**: JSON Server

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 运行项目

1. **启动后端服务**（终端1）:
```bash
npm run serve
```
后端服务将运行在 http://localhost:3001

2. **启动前端开发服务器**（终端2）:
```bash
npm run dev
```
前端页面将运行在 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
├── src/
│   ├── components/          # 组件目录
│   │   ├── TaskFilter.tsx   # 任务过滤器组件
│   │   ├── TaskForm.tsx     # 任务表单组件
│   │   ├── TaskList.tsx     # 任务列表组件
│   │   └── TaskStats.tsx    # 任务统计组件
│   ├── data/               # 数据目录
│   │   └── db.json         # 模拟数据库
│   ├── hooks/              # 自定义hooks
│   │   └── useTasks.ts     # 任务管理hook
│   ├── types/              # 类型定义
│   │   └── task.ts         # 任务类型定义
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # TailwindCSS配置
├── postcss.config.js       # PostCSS配置
└── tsconfig.json           # TypeScript配置
```

## 使用说明

1. **添加任务**: 点击右上角"添加任务"按钮，填写任务信息后提交
2. **编辑任务**: 点击任务卡片右侧的编辑图标
3. **删除任务**: 点击任务卡片右侧的删除图标
4. **切换状态**: 点击任务左侧的圆形图标
5. **筛选任务**: 使用顶部的搜索框和筛选下拉菜单

## 许可证

MIT
