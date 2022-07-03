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

// const DEFAULT_OPTIONS = {
//   headers: { "Content-Type": "application/json" },
// }

// export default function useFetch(url, options = {}, dependencies = []) {
//   return useAsync(() => {
//     return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then(res => {
//       if (res.ok) return res.json()
//       return res.json().then(json => Promise.reject(json))
//     })
//   }, dependencies)
// }

// const { loading, error, value } = useFetch(
//   `https://jsonplaceholder.typicode.com/todos/${id}`,
//   {},
//   [id]
// );
