import { useState } from 'react';
/* eslint-disable no-unused-vars */
import { useCart } from '../context/useCart';

export default function Soporte() {
  const [form, setForm] = useState({ nombre: '', email: '', problema: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Número de WhatsApp del negocio (cámbialo al tuyo)
    const numero = '5491122334455'; // ← sin espacios ni +
    const mensaje = `¡Hola NEOTec!%0A
    Nombre: ${form.nombre}%0A
    Email: ${form.email}%0A
    Problema: ${form.problema}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    // Guardar en localStorage
    const historial = JSON.parse(localStorage.getItem('neotec-soporte') || '[]');
    historial.push({ ...form, fecha: new Date().toLocaleString() });
    localStorage.setItem('neotec-soporte', JSON.stringify(historial));

    setEnviado(true);
    setForm({ nombre: '', email: '', problema: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
      <h2>Soporte técnico NEOTec</h2>

      {enviado && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          ¡Mensaje enviado por WhatsApp!
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Nombre completo:
          <br />
          <input name="nombre" value={form.nombre} onChange={handleChange} required />
        </label>
        <br /><br />

        <label>
          Correo electrónico:
          <br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <br /><br />

        <label>
          Describe el problema:
          <br />
          <textarea name="problema" value={form.problema} onChange={handleChange} rows={5} required />
        </label>
        <br /><br />

        <button className="btn" type="submit">
          Enviar por WhatsApp
        </button>
      </form>
    </div>
  );
}