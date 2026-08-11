import { useState, useEffect, useCallback } from 'react';
import { AxiosPromise } from 'axios';

interface UseQueryOptions {
  enabled?: boolean;
  retry?: number;
  retryDelay?: number;
}

export function useQuery<T>(
  queryFn: () => AxiosPromise<T>,
  options: UseQueryOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { enabled = true, retry = 3, retryDelay = 1000 } = options;

  const execute = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const response = await queryFn();
      setData(response.data);
      setRetryCount(0);
    } catch (err: any) {
      const message = err.message || 'Query failed';
      setError(message);

      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, retryCount, retry, retryDelay]);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}
