const useTimeout = (cb, delay) => {
  const callbackRef = useRef(cb);
  const timeoutRef = useRef();

  useEffect(() => {
    callbackRef.current = cb;
  }, [cb]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current, delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return [clear, set];
};

export default useTimeout;

// example:
// const [count, setCount] = useState(10);
// const { clear, set } = useTimeout(() => setCount(0), 1000);
