import React from 'react';

class Select extends React.Component<any, any> {
  static Option: (props: any) => JSX.Element;

  render() {
    return (
      <select {...this.props} className="form-input">
        <option label={this.props.placeholder} value={undefined}>
          {this.props.placeholder}
        </option>
        {this.props.children}
      </select>
    );
  }
}
/* 绑定静态属性   */
Select.Option = function (props: any) {
  return <option {...props} label={props.children}></option>;
};

export default Select;
