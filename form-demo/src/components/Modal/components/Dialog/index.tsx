import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';

// 当弹窗要显示的时候，要先设置 modelShow 让组件显示，然后用 setTimeout 调度让 modelShowAync 触发执行动画。
// 当弹窗要隐藏的时候，需要先让动画执行，所以先控制 modelShowAync ，然后通过控制 modelShow 元素隐藏，和上述流程相反。
// 用一个控制器 controlShow 来流畅执行更新任务。
const controlShow = (f1: any, f2: any, value: any, timer: any) => {
  f1(value);
  return setTimeout(() => {
    f2(value);
  }, timer);
};

// 控制显示隐藏
const Dialog: React.FC<any> = (props) => {
  const { width, visible, closeCb, onClose } = props;
  // modelShow 让元素显示/隐藏，modelShowAync 控制动画执行
  const [modelShow, setModelShow] = useState(visible);
  const [modelShowAync, setModelShowAync] = useState(visible);

  useEffect(() => {
    let timer: any;
    if (visible) {
      timer = controlShow(setModelShow, setModelShowAync, visible, 30);
    } else {
      timer = controlShow(setModelShowAync, setModelShow, visible, 1000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [visible]);

  /* 执行关闭弹窗后的回调函数 closeCb */
  useEffect(() => {
    !modelShow && typeof closeCb === 'function' && closeCb();
  }, [modelShow]);

  const renderChildren = useMemo(() => {
    /* 把元素渲染到组件之外的 document.body 上  */
    return ReactDOM.createPortal(
      <div
        className="modal_dialog"
        style={{ display: modelShow ? 'block' : 'none' }}
      >
        <div
          className="model_container"
          style={{ opacity: modelShowAync ? 1 : 0 }}
        >
          <div className="model_wrap">
            <div style={{ width: width + 'px' }}> {props.children} </div>
          </div>
        </div>
        <div
          className="model_container mast"
          onClick={() => onClose && onClose()}
          style={{ opacity: modelShowAync ? 0.6 : 0 }}
        />
      </div>,
      document.body,
    );
  }, [modelShowAync, modelShow]);

  return renderChildren;
};

export default Dialog;
