// src/app/hooks/useCache.ts
import { useEffect, useState } from "react";
import { useCacheStore } from "../store/cacheStore";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

// Interface pour les données de produit
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// Interface générique pour le hook
interface UseCachedDataOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  enabled?: boolean;
  initialData?: T;
}

export function useCachedData<T = any>(
  options: UseCachedDataOptions<T>
) {
  const { key, fetchFn, enabled = true, initialData } = options;
  
  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchData, isCacheValid } = useCacheStore();

  useEffect(() => {
    if (!enabled) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchData(key, fetchFn);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        console.error('❌ Erreur useCachedData:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key, fetchFn, enabled, fetchData]);

  const isCached = useCacheStore(state => 
    state.data.has(key) && isCacheValid()
  );

  return {
    data,
    isLoading,
    error,
    isCached,
    refetch: async () => {
      setIsLoading(true);
      try {
        const result = await fetchData(key, fetchFn);
        setData(result);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    clear: () => {
      useCacheStore.getState().data.delete(key);
      setData(null);
    }
  };
}

// Hook spécialisé pour les produits
export function useCachedProduct(productId: string) {
  return useCachedData<Product>({
    key: `product-${productId}`,
    fetchFn: async () => {
      const response = await fetch(`API_BASE_URL/${productId}`);
      if (!response.ok) throw new Error('Produit non trouvé');
      return response.json();
    }
  });
}