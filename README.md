# preheating-nodejs8
Preheating instances
## 注意事项：
1. 预热函数需要执行被预热的函数，所以需要为预热函数授予执行函数的权限，如：`AliyunFCInvocationAccess`
2. 被预热函数可以通过 event 的 preheating 或者 request 的 header 属性 x-preheating 判断是否由预热函数触发，如果是，则在函数计算入口函数中，跳过业务逻辑即可
