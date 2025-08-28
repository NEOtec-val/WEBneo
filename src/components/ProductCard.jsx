import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, width: 220 }}>
      <img src={product.image} alt={product.name} width="100%" />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button className="btn" onClick={() => addToCart(product)}>Agregar</button>
    </div>
  );
}