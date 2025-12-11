// Dans vos pages/components
import { useCachedData } from "./hooks/useCache";
export default function ProductPage() {
  const product = useCachedData('product-123');
  
  if (!product) return <Spinner />;
  
  return (
    <div>
      <h1>{product.name}</h1>
      {/* Affichage instantané grâce au cache */}
    </div>
  );
}