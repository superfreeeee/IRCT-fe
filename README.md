# IRCT = Innovation Remote collaboration tools

- 部署
  - [http://crafteam.cn/](http://crafteam.cn/)
  - [https://irct-fe.vercel.app/](https://irct-fe.vercel.app/)

## TODO

### Feature1(Done)

- [x] IM 当前使用应用 icon
- [x] 房间声波更新
- [x] IM 跟随功能
- [x] Date、Doc、Path 展开图片实现
- [x] 状态点 tooltip
- [x] RoomSpace Team header 详情
- [x] 临时会议发起
- [x] RoomSpace 房间头像
  - [x] 选人加入列表
- [x] RoomSpace header action
  - [x] 锁定
  - [x] IM 锁定同步
  - [x] 请求创建固定会议
  - [x] 选人组件列表
- [x] RoomSpace Meeting Room 实现
- [x] VideoRoom 平滑移入
- [x] VideoRoom 加入视频
- [x] IM 合作功能 => 打开页面

### Feature2

- [x] 跳转
  - [x] 人物聊天页面跳转
- [x] 主视图
  - [x] 关系颜色渐层
  - [x] 人物节点透明度遮罩
  - [x] 个人视图数据
  - [x] 个人视图颜色填充
  - [x] 人物点 active
  - [x] O/KR/Project/Todo active 状态
  - [x] 组织视图 O-O 关系
    - [x] 关联点 Hover
  - [x] pop record disabled
  - [x] pop stack bug fix(recoil 缓存到上一次的状态)
  - [x] Hover tooltip 简单信息
  - [x] 视窗 resize/container size change => 更新 svg 大小
    - [x] svg 使用 100% 可以解决
    - [x] mask 大小可能因为 viewpoint 被压缩 -> 取消 mask，直接标记在 svg 上
  - [x] 右键操作列表
  - [x] 同 id Node 应该同时亮起
  - [x] O, Project 对齐人头样式
  - [x] Project 对齐人头选中时展示
  - [ ] Path List 关闭按钮
- [x] 侧边栏
  - [x] 侧边栏定位
  - [x] 侧边栏填充数据（静态）
  - [x] 侧边栏折叠
  - [x] 侧边栏项hover 联动
  - [x] O, KR, Project, Todo 关联人头
  - [x] Path List 项目右键
  - [x] 编辑联动
    - [x] 添加节点编辑联动
    - [x] 更新节点编辑联动
    - [x] 删除节点编辑联动
- [x] 编辑
  - [x] 编辑 Modal UI
  - [x] 编辑 Modal 数据传递
  - [x] 添加/删除节点
    - [x] 添加 O
    - [x] 编辑 O
    - [x] 添加 KR
    - [x] 编辑 KR
    - [x] 添加 Project
    - [x] 编辑 Project
    - [x] 添加 Todo
    - [x] 编辑 Todo
    - [x] 删除 Todo

### 边缘 feature

- [ ] SideApp 图片

### Bug fix

- [x] 新增 Project 时右侧 relativeUsers 没有同步
- [x] 从 PathList 新增 Todo 时节点异常（出现头像，疑似加入了 User 而非 Todo 节点）

## 问题

- IM 的未读信息：暂时不要，保留
