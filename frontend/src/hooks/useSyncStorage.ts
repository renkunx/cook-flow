import { useState, useEffect, useCallback } from 'react';

// 使用 localStorage + BroadcastChannel 实现多标签页同步
export function useSyncStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // 获取初始值
  const getStoredValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 设置值并同步到其他标签页
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // 广播更新到其他标签页
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('app_sync');
        channel.postMessage({ key, value: valueToStore });
        channel.close();
      }
      
      // 同时触发 storage 事件（用于不支持 BroadcastChannel 的浏览器）
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(valueToStore),
        oldValue: JSON.stringify(storedValue),
        storageArea: localStorage,
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听其他标签页的更新
  useEffect(() => {
    // 处理 storage 事件
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error parsing storage value:', error);
        }
      }
    };

    // 处理 BroadcastChannel 消息
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('app_sync');
      channel.onmessage = (event) => {
        if (event.data.key === key) {
          setStoredValue(event.data.value);
        }
      };
    }

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, [key]);

  return [storedValue, setValue];
}
