/**
 * API 调用 Hooks
 * 简化 React 组件中的 API 调用
 */

import { useState, useEffect, useCallback } from 'react';
import type { PaginationResponse, ApiError } from '@/types/api';

interface UseApiOptions<T> {
  initialData?: T;
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiState<T> {
  data: T | undefined;
  loading: boolean;
  error: ApiError | null;
}

/**
 * 通用 API 调用 Hook
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const { initialData, immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err: any) {
      const apiError: ApiError = err.response?.data || { error: true, msg: err.message };
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * 分页列表 API Hook
 */
export function usePaginatedList<T>(
  apiCall: (params?: Record<string, unknown>) => Promise<PaginationResponse<T>>,
  initialParams?: Record<string, unknown>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [params, setParams] = useState(initialParams || {});
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const fetchData = useCallback(async (overrideParams?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedParams = { ...params, ...overrideParams };
      const result = await apiCall(mergedParams);
      setData(result.results);
      setPagination({
        count: result.count,
        next: result.next,
        previous: result.previous,
      });
    } catch (err: any) {
      setError(err.response?.data || { error: true, msg: err.message });
    } finally {
      setLoading(false);
    }
  }, [apiCall, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (!pagination.next || loading) return;
    
    setLoading(true);
    try {
      // 从 next URL 中提取参数
      const url = new URL(pagination.next);
      const nextParams: Record<string, unknown> = {};
      url.searchParams.forEach((value, key) => {
        nextParams[key] = value;
      });
      
      const result = await apiCall({ ...params, ...nextParams });
      setData((prev) => [...prev, ...result.results]);
      setPagination({
        count: result.count,
        next: result.next,
        previous: result.previous,
      });
    } catch (err: any) {
      setError(err.response?.data || { error: true, msg: err.message });
    } finally {
      setLoading(false);
    }
  }, [apiCall, pagination.next, loading, params]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    loadMore,
    setParams,
  };
}

/**
 * 单个资源 API Hook
 */
export function useResource<T>(
  apiCall: (id: number) => Promise<T>,
  id: number | undefined
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (id === undefined) {
      setData(undefined);
      return;
    }

    setLoading(true);
    setError(null);

    apiCall(id)
      .then(setData)
      .catch((err) => setError(err.response?.data || { error: true, msg: err.message }))
      .finally(() => setLoading(false));
  }, [apiCall, id]);

  const update = useCallback(async (updateData: Partial<T>) => {
    if (id === undefined) return;
    
    setLoading(true);
    try {
      // 假设 apiCall 返回的对象有 update 方法
      // 实际使用时需要根据具体 API 调整
      const updated = await apiCall(id);
      setData(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data || { error: true, msg: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, id]);

  return { data, loading, error, update };
}

/**
 * 突变操作 Hook（创建、更新、删除）
 */
export function useMutation<T, P = unknown>(
  apiCall: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(async (params: P) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(params);
      setData(result);
      return result;
    } catch (err: any) {
      const apiError = err.response?.data || { error: true, msg: err.message };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, mutate, reset };
}

export default { useApi, usePaginatedList, useResource, useMutation };
