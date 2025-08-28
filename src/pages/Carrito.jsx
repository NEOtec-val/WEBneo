import { useCart } from '../context/useCart';


export default function Carrito() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Mi carrito</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map(p => (
              <li key={p.id}>
                {p.name} — ${p.price} × {p.cantidad}
                <button onClick={() => removeFromCart(p.id)} style={{ marginLeft: 8 }}>❌</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
          <button className="btn" onClick={clearCart}>Vaciar carrito</button>
        </>
      )}
    </div>
  );
}