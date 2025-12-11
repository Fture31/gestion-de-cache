// src/app/store/cacheStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface CacheData<T = any> {
  [key: string]: T;
}

interface CacheStore {
  data: Map<string, any>;
  lastFetch: number | null;
  
  // Actions
  isCacheValid: () => boolean;
  fetchData: <T>(key: string, apiCall: () => Promise<T>) => Promise<T>;
  setData: <T>(key: string, value: T) => void;
  clearCache: () => void;
}

export const useCacheStore = create<CacheStore>()(
  persist(
    (set, get) => ({
      data: new Map(),
      lastFetch: null,

      isCacheValid: (): boolean => {
        const last = get().lastFetch;
        return !!last && (Date.now() - last) < 24 * 60 * 60 * 1000;
      },

      fetchData: async <T>(key: string, apiCall: () => Promise<T>): Promise<T> => {
        // 1. Vérifier le cache d'abord
        const cachedData = get().data.get(key);
        if (cachedData && get().isCacheValid()) {
          console.log('📦 Retour depuis le cache:', key);
          return cachedData as T;
        }

        console.log('🔄 Chargement depuis API:', key);
        
        // 2. Appel API
        const freshData = await apiCall();
        
        // 3. Mettre en cache
        const newData = new Map(get().data);
        newData.set(key, freshData);
        
        set({ 
          data: newData,
          lastFetch: Date.now() 
        });
        
        return freshData;
      },

      setData: <T>(key: string, value: T): void => {
        const newData = new Map(get().data);
        newData.set(key, value);
        set({ data: newData });
      },

      clearCache: (): void => {
        set({ data: new Map(), lastFetch: null });
      }
    }),
    {
      name: 'app-cache-storage',
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              data: new Map(parsed.state.data || [])
            }
          };
        },
        setItem: (name: string, value: any) => {
          const toStore = {
            ...value,
            state: {
              ...value.state,
              data: Array.from(value.state.data.entries())
            }
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name: string) => localStorage.removeItem(name)
      }
    }
  )
);