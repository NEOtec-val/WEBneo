import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import Soporte from './pages/Soporte';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/soporte" element={<Soporte />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}