// src/app/product/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Spinner from '@/app/components/Spinner';
import { useCachedProduct } from '@/app/hooks/useCache';

// Interface pour les props (si besoin)
interface ProductPageProps {
  params?: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // Utiliser useParams si dans App Router
  const routerParams = useParams();
  const productId = params?.id || routerParams?.id as string;

  // Utiliser notre hook avec cache
  const { 
    data: product, 
    isLoading, 
    error, 
    isCached,
    refetch 
  } = useCachedProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">
            Chargement du produit...
            {isCached && <span className="text-green-600 ml-2">(depuis le cache)</span>}
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-2">Erreur</p>
          <p className="text-gray-500">{error || 'Produit non trouvé'}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Indicateur de cache */}
      {isCached && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm inline-flex items-center">
          <span className="mr-2">⚡</span>
          Affiché depuis le cache (mise à jour automatique après 24h)
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600">
            {product.price.toFixed(2)} €
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={refetch}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Forcer le rechargement
          </button>
          
          <div className="text-sm text-gray-500">
            <p>ID: {product.id}</p>
            <p>Cache valide: {isCached ? 'Oui (24h)' : 'Non'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}