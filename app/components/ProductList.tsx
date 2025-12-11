// src/app/components/ProductList.tsx
'use client';

import { useCachedData } from '@/app/hooks/useCache';
import { fetchProducts, ApiProduct } from '@/app/utils/products';
import Spinner from './Spinner';

export default function ProductList() {
  const { 
    data: products, 
    isLoading, 
    error,
    isCached 
  } = useCachedData<ApiProduct[]>({
    key: 'all-products',
    fetchFn: fetchProducts
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Spinner />
        <p className="mt-2 text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {isCached && (
        <div className="mb-4 text-sm text-green-600">
          ⚡ Produits chargés depuis le cache
        </div>
      )}
      
      <h2 className="text-2xl font-bold mb-6">Produits ({products?.length || 0})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">{product.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}