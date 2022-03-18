import { useMemo, useRef, useState } from 'react';
import Form, { FormItem, Input, Select } from '@/components/Form';
import Modal from '@/components/Modal';

export default function IndexPage() {
  const form = useRef<any>(null);
  const handleClick = () => {
    form.current.submit((res: any) => {
      console.log(res);
    });
  };
  const handleGetValue = () => {
    console.log('form.current ', form.current);
  };

  const [visible, setVisible] = useState(false);
  /* 使用 useMemo 防止 Model 的 PureComponent 失去作用 */
  const [handleClose, handleOk, handleCancel] = useMemo(() => {
    const Ok = () => console.log('点击确定按钮');
    const Close = () => setVisible(false);
    const Cancel = () => console.log('点击取消按钮');
    return [Close, Ok, Cancel];
  }, []);
  // 挂载弹窗组件点击事件
  const handleModalClick1 = () => {
    setVisible(!visible);
  };
  // 静态属性点击事件
  const handleModalClick2 = () => {
    Modal.show({
      content: <p>确定购买《React进阶指南小册》吗</p>,
      title: '《React进阶实践指南》',
      onOk: () => console.log('点击确定'),
      onCancel: () => console.log('点击取消'),
      onClose: () => Modal.hidden(),
    });
  };

  return (
    <div>
      <div className="custom_modal">
        <h2>自定义弹窗</h2>
        {/* 1.0 挂载组件 */}
        <Modal
          onCancel={handleCancel}
          onClose={handleClose}
          onOk={handleOk}
          title={'《React进阶实践指南》'}
          visible={visible}
          width={700}
        >
          <div className="feel">
            小册阅读感受： <input placeholder="写下你的感受" />
          </div>
        </Modal>
        <button onClick={handleModalClick1}> model show </button>
        {/* 2.0 静态属性 */}
        <button onClick={handleModalClick2}>静态方式调用，显示modal</button>
      </div>
      <div className="form_container">
        <h2>表单验证</h2>
        <Form initialValues={{ author: '我不是外星人' }} ref={form}>
          <FormItem
            label="请输入小册名称"
            labelWidth={150}
            name="name"
            required
            rules={{
              rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,32}$/,
              message:
                '名称仅支持中文、英文字母、数字和下划线，长度限制4~32个字',
            }}
            validateTrigger="onBlur"
          >
            <Input placeholder="小册名称" />
          </FormItem>
          <FormItem
            label="作者"
            labelWidth={150}
            name="author"
            required
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入作者" />
          </FormItem>
          <FormItem
            label="邮箱"
            labelWidth={150}
            name="email"
            rules={{
              rule: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
              message: '邮箱格式错误！',
            }}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入邮箱" />
          </FormItem>
          <FormItem
            label="手机"
            labelWidth={150}
            name="phone"
            rules={{ rule: /^1[3-9]\d{9}$/, message: '手机格式错误！' }}
            validateTrigger="onBlur"
          >
            <Input placeholder="请输入手机号" />
          </FormItem>
          <FormItem
            label="简介"
            labelWidth={150}
            name="des"
            rules={{
              rule: (value = '') => value?.length < 5,
              message: '简介不超过五个字符',
            }}
            validateTrigger="onBlur"
          >
            <Input placeholder="输入简介" />
          </FormItem>
          <FormItem
            label="你最喜欢的前端框架"
            labelWidth={150}
            name="likes"
            required
          >
            <Select placeholder="请选择" width={120}>
              <Select.Option value={1}> React.js </Select.Option>
              <Select.Option value={2}> Vue.js </Select.Option>
              <Select.Option value={3}> Angular.js </Select.Option>
            </Select>
          </FormItem>
          <button className="searchbtn" onClick={handleClick} type="button">
            提交
          </button>
          <button className="concellbtn" type="reset">
            重置
          </button>
        </Form>
        <div style={{ marginTop: '80px' }}>
          <span>验证表单功能</span>
          <button
            className="searchbtn"
            onClick={handleGetValue}
            style={{ background: 'green' }}
          >
            获取表单数层
          </button>
          <button
            className="searchbtn"
            onClick={() =>
              form.current.validateFields((res: any) => {
                console.log('是否通过验证：', res);
              })
            }
            style={{ background: 'orange' }}
          >
            动态验证表单
          </button>
          <button
            className="searchbtn"
            onClick={() => {
              form.current.setFieldsValue('des', {
                rule: (value = '') => value?.length < 10,
                message: '简介不超过十个字符',
              });
            }}
            style={{ background: 'purple' }}
          >
            动态设置校验规则
          </button>
        </div>
      </div>
    </div>
  );
}
