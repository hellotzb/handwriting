import { useCallback, useEffect, useState } from 'react';

export default function useAsync(callback, dependencies = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value };
}

// example
// const { loading, error, value } = useAsync(() => {
//   return new Promise((resolve, reject) => {
//     const success = false;
//     setTimeout(() => {
//       success ? resolve('Hi') : reject('Error');
//     }, 1000);
//   });
// });
