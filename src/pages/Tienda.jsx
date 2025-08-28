import { useCart } from '../context/useCart';

export default function Tienda() {
  const { addToCart } = useCart();

  const productos = [
    { id: 1, name: 'Impresora HP', price: 399 },
    { id: 2, name: 'Laptop Dell', price: 599 },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Catálogo</h2>
      {productos.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem', width: 220 }}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button
            className="btn"
            onClick={() => {
              console.log('Agregando:', product);
              addToCart(product);
            }}
          >
            Agregar
          </button>
        </div>
      ))}
    </div>
  );
}