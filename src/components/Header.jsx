export default function Header() {
  return (
    <header style={{ background: '#111', color: '#fff', padding: '1rem' }}>
      <h1>NEOTec Soluciones Informáticas</h1>
      <nav>
        <a href="/" style={{ color: '#fff', marginRight: '1rem' }}>Inicio</a>
        <a href="/tienda" style={{ color: '#fff', marginRight: '1rem' }}>Tienda</a>
        <a href="/soporte" style={{ color: '#fff' }}>Soporte</a>
        <a href="/soporte" style={{ color: '#fff', marginLeft: '1rem' }}>Soporte</a>
        <a href="/carrito" style={{ color: '#fff', marginLeft: '1rem' }}>🛒 Carrito</a>
        
      </nav>
    </header>
  );
}