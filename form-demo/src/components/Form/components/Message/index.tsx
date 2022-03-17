// message 显示表单验证的状态，比如失败时候的提示文案等，成功时候的提示文案。
const Message: React.FC<any> = (props) => {
  const { status, message, required, name, value } = props;
  let showMessage: string | null = '';
  let color = '#fff';
  if (required && !value && status === 'reject') {
    showMessage = `${name} 为必填项`;
    color = 'red';
  } else if (status === 'reject') {
    showMessage = message;
    color = 'red';
  } else if (status === 'pendding') {
    showMessage = null;
  } else if (status === 'resolve') {
    showMessage = '校验通过';
    color = 'green';
  }
  return (
    <div className="form-message">
      <span style={{ color }}>{showMessage}</span>
    </div>
  );
};

export default Message;
