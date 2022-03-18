import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Dialog from './components/Dialog';
// 需要把弹窗组件渲染到挂载的容器之外，这样不受到父组件的影响。这里可以通过 ReactDOM.createPortal API解决这个问题。
// ReactDOM.createPortal(child, container);
let ModalContainer: any = null;
const modelSysbol = Symbol('$$__model__Container_hidden');

class Modal extends React.PureComponent<any> {
  static show: (config: any) => any;
  static hidden: () => void;
  /* 渲染底部按钮 */
  renderFooter = () => {
    const { onOk, onCancel, cancelText, okText, footer } = this.props;
    /* 触发 onOk / onCancel 回调  */
    if (footer && React.isValidElement(footer)) return footer;
    return (
      <div className="model_bottom">
        <div className="model_btn_box">
          <button
            className="searchbtn"
            onClick={(e) => {
              onOk && onOk(e);
            }}
          >
            {okText || '确定'}
          </button>
          <button
            className="concellbtn"
            onClick={(e) => {
              onCancel && onCancel(e);
            }}
          >
            {cancelText || '取消'}
          </button>
        </div>
      </div>
    );
  };

  /* 渲染顶部 */
  renderTop = () => {
    const { title, onClose } = this.props;
    return (
      <div className="model_top">
        <p>{title}</p>
        <span className="model_top_close" onClick={() => onClose && onClose()}>
          x
        </span>
      </div>
    );
  };

  /* 渲染弹窗内容 */
  renderContent = () => {
    const { content, children } = this.props;
    return React.isValidElement(content) ? content : children ? children : null;
  };

  render() {
    const { visible, width = 500, closeCb, onClose } = this.props;
    return (
      <Dialog
        closeCb={closeCb}
        onClose={onClose}
        visible={visible}
        width={width}
      >
        {this.renderTop()}
        {this.renderContent()}
        {this.renderFooter()}
      </Dialog>
    );
  }
}

/* 静态属性show——控制 */
Modal.show = function (config: any) {
  /* 如果modal已经存在了，那么就不需要第二次show */
  if (ModalContainer) return;
  const props = { ...config, visible: true };
  const container: any = (ModalContainer = document.createElement('div'));
  /* 创建一个管理者，管理moal状态 */
  const manager: any = (container[modelSysbol] = {
    setShow: null,
    mounted: false,
    hidden() {
      const { setShow } = manager;
      setShow && setShow(false);
    },
    destory() {
      /* 卸载组件 */
      ReactDOM.unmountComponentAtNode(container);
      /* 移除节点 */
      document.body.removeChild(container);
      /* 置空元素 */
      ModalContainer = null;
    },
  });
  const ModelApp = (props: any) => {
    const [show, setShow] = useState(false);
    manager.setShow = setShow;
    const { visible, ...trueProps } = props;
    useEffect(() => {
      /* 加载完成，设置状态 */
      manager.mounted = true;
      setShow(visible);
    }, []);
    return (
      <Modal
        {...trueProps}
        closeCb={() => manager.mounted && manager.destory()}
        visible={show}
      />
    );
  };
  /* 插入到body中 */
  document.body.appendChild(container);
  /* 渲染React元素 */
  ReactDOM.render(<ModelApp {...props} />, container);
  return manager;
};

/* 静态属性——hidden控制隐藏 */
Modal.hidden = function () {
  if (!ModalContainer) return;
  /* 如果存在 ModalContainer 那么隐藏 ModalContainer  */
  ModalContainer[modelSysbol] && ModalContainer[modelSysbol].hidden();
};

export default Modal;
