// useForm -> 维护和管理表单状态实例 FormStore
import { useRef, useState } from 'react';
import { FormStore } from '@/instances';

export const useForm = (form: any, defaultFormValue = {}) => {
  const formRef: any = useRef(null);
  const [, forceUpdate] = useState({});
  if (!formRef.current) {
    if (form) {
      formRef.current = form; /* 如果已经有 form，那么复用当前 form  */
    } else {
      /* 没有 form 创建一个 form */
      const formStoreCurrent = new FormStore(forceUpdate, defaultFormValue);
      /* 获取实例方法 */
      formRef.current = formStoreCurrent.getForm();
    }
  }
  return formRef.current;
};
