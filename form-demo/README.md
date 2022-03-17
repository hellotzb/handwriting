# 表单验证

一个完整验证表单体系实际是很复杂的，整个流程可以分为，状态收集 ，状态管理 ，状态验证 ， 状态下发 。

```
<Form onFinish={onFinish} >
   <FormItem name="name"  label="小册名称" >
       <Input />
   </FormItem>
    <FormItem name="author"  label="小册作者" >
       <Input />
   </FormItem>
   <Button htmlType="submit" >确定</Button>
</Form>
```
