import { useState, useCallback } from 'react';
import { AxiosPromise } from 'axios';

interface UseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useMutation<T, R = any>(
  mutationFn: (data: T) => AxiosPromise<R>,
  options: UseMutationOptions = {}
) {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError } = options;

  const mutate = useCallback(
    async (variables: T) => {
      setLoading(true);
      setError(null);
      try {
        const response = await mutationFn(variables);
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.message || 'Mutation failed';
        setError(message);
        onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}
