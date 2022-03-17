import React from 'react';

const BasicLayout: React.FC = (props) => {
  return (
    <div>
      <p>BasicLayout</p>
      {props.children}
    </div>
  );
};

export default BasicLayout;
