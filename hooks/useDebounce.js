const useDebounce = (cb, delay, dependencies) => {
  const { reset, clear } = useTimeout(cb, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
};

// example
// 每次点击count+1，在count停止变化1s后才打印count
useDebounce(() => alert(count), 1000, [count]);
