// Input 本质上就是 input 标签。
const Input: React.FC<any> = (props) => {
  return <input className="form-input" {...props} />;
};

export default Input;
