# 表单验证

一个完整验证表单体系实际是很复杂的，整个流程可以分为，状态收集 ，状态管理 ，状态验证 ， 状态下发 。

```
<Form onFinish={onFinish} >
   <FormItem name="name"  label="名称" >
       <Input />
   </FormItem>
    <FormItem name="author"  label="作者" >
       <Input />
   </FormItem>
   <button className="searchbtn" onClick={handleClick} type="button">
       提交
   </button>
</Form>
```

# 自定义弹窗

编写的自定义 Modal 可以通过两种方式调用

## 第一种通过挂载组件方式，动态设置 visible 属性

```
<Modal  title={'《React进阶实践指南》'}  visible={visible}  >
    <div> hello,world </div>
</Modal>
```

## 第二种通过 Modal 静态属性方法，控制 Modal 的显示/隐藏。Modal.show 控制自定义弹窗的显示，可以通过 Modal.hidden 控制弹窗的隐藏，业务层不需要挂载组件

```
 Modal.show({ /* 自定义弹窗的显示 */
    content:<p>确定吗</p>,
    title:'Hello World',
    onOk:()=>console.log('点击确定'),
    onCancel:()=>console.log('点击取消'),
    onClose:()=> Modal.hidden() /* 自定义弹窗的隐藏 */
})
```

挂载组件
一个 React 应用，可以有多个 root Fiber， 所以可以通过 ReactDOM.render 来实现组件的自由挂载。

卸载组件
上面既然完成了挂载组件，下面需要在隐藏 Modal 的时候去卸载组件。 可以通过 ReactDOM.unmountComponentAtNode 来实现这个功能。
unmountComponentAtNode 从 DOM 中卸载组件，会将其事件处理器和 state 一并清除。 如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 true ，如果没有组件可被移除将会返回 false 。
