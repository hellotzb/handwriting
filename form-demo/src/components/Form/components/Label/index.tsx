// Label 的作用就是渲染表单的标签。
const Label: React.FC<any> = ({
  children,
  label,
  labelWidth,
  required,
  height,
}) => {
  return (
    <div className="form-label" style={{ height: height + 'px' }}>
      <div className="form-label-name" style={{ width: `${labelWidth}px` }}>
        {required ? <span style={{ color: 'red' }}>*</span> : null}
        {label}:
      </div>{' '}
      {children}
    </div>
  );
};
export default Label;
