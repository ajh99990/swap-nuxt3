## 约定
1. 所有的processManagers都放在根目录的`/processManagers`目录下
2. `/plugins`目录内的插件提供了一些基础功能。这部分代码在写业务代码的过程中是不需要做任何改动的。
3. `/pages`内的每个页面都应该在`/modules`内对应一个同名文件夹，这个文件夹是用来存放页面需要用到的私有组件的。index页面对应的文件夹名为home




## todo
### /api/service
1. mode切换
2. JSONbig的支持
3. 拦截器的支持
4. 原始构造函数的支持