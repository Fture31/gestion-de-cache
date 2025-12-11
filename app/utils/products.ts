// src/app/api/products.ts
// Fonctions API typées pour les appels réseau
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  inStock?: boolean;
}

export async function fetchProduct(productId: string): Promise<ApiProduct> {
  // Exemple avec fetch
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const data = await response.json();
  
  // Validation basique
  if (!data.id || !data.name) {
    throw new Error('Format de données invalide');
  }

  return data as ApiProduct;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const data = await response.json();
  return data as ApiProduct[];
}