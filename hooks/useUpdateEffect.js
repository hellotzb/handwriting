// 只有当dependencies变化时才执行cb，且首次渲染不执行
const useUpdateEffect = (cb, dependencies) => {
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return cb();
  }, dependencies);
};

// example
useUpdateEffect(() => alert(count), [count]);
