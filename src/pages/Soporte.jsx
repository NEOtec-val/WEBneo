import { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { useCart } from '../context/useCart';

const API_URL = 'https://neotec-api.bot/api/chat';

export default function Soporte() {
  const [form, setForm] = useState({ nombre: '', email: '', problema: '' });
  const [enviado, setEnviado] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    setMessages([{ 
      type: 'bot', 
      text: '👋 ¡Hola! Soy el asistente de NEOtec Soporte Técnico.\n\n💻 ¿En qué puedo ayudarte hoy?\n- Problemas con laptop/PC\n- Instalación de impresoras\n- WiFi, redes\n- Y más...',
      time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  useEffect(() => {
    constinterval = setInterval(async () => {
      try {
        const resp = await fetch(`${API_URL}/${sessionId}?t=${Date.now()}`);
        const data = await resp.json();
        if (data.response && data.hasReply) {
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: data.response,
            time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const numero = '59160722786';
    const mensaje = `¡Hola NEOTec!%0A
Nombre: ${form.nombre}%0A
Email: ${form.email}%0A
Problema: ${form.problema}`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    const historial = JSON.parse(localStorage.getItem('neotec-soporte') || '[]');
    historial.push({ ...form, fecha: new Date().toLocaleString() });
    localStorage.setItem('neotec-soporte', JSON.stringify(historial));
    setEnviado(true);
    setForm({ nombre: '', email: '', problema: '' });
  };

  const sendMessage = async () => {
    if (!inputMsg.trim()) return;
    const userMsg = inputMsg.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMsg, time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) }]);
    setInputMsg('');
    setTyping(true);
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId })
      });
      const data = await resp.json();
      setTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: data.response, time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (error) {
      setTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: 'Disculpa, tuve un problema. Puedes escribirnos directamente al WhatsApp.', time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const quickActions = [
    { text: '💻 Mi laptop no enciende', msg: 'Mi laptop no enciende' },
    { text: '🖥️ Mi PC está lenta', msg: 'Mi PC está muy lenta' },
    { text: '🖨️ Instalar impresora', msg: 'Quiero instalar una impresora' },
    { text: '📶 Problema WiFi', msg: 'Tengo problema con el WiFi' },
    { text: '💾 Recuperar datos', msg: 'Necesito recuperar datos' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
      <h2>Soporte técnico NEOtec</h2>

      <button 
        className="btn" 
        onClick={() => setChatOpen(!chatOpen)}
        style={{ marginBottom: '1rem' }}
      >
        💬 Chat en Vivo {chatOpen ? '✕' : '↗'}
      </button>

      {chatOpen && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '1rem',
          background: '#fff'
        }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontWeight: 'bold' }}>NEOtec Chat</span>
          <span style={{ fontSize: '12px', opacity: 0.9 }}>En línea</span>
        </div>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '10px',
          background: '#f8f9fa'
        }}>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => { setInputMsg(action.msg); sendMessage(); }}
              style={{
                padding: '8px 12px',
                border: '1px solid #667eea',
                background: 'white',
                color: '#667eea',
                borderRadius: '20px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {action.text}
            </button>
          ))}
        </div>

        <div style={{
          height: '250px',
          overflowY: 'auto',
          padding: '15px',
          background: '#f8f9fa'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              maxWidth: '85%',
              marginBottom: '10px',
              padding: '10px 15px',
              borderRadius: '15px',
              fontSize: '14px',
              background: msg.type === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'white',
              color: msg.type === 'user' ? 'white' : '#333',
              marginLeft: msg.type === 'user' ? 'auto' : '0',
              borderBottomRightRadius: msg.type === 'user' ? '5px' : '15px',
              borderBottomLeftRadius: msg.type === 'bot' ? '5px' : '15px',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
              <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '5px' }}>{msg.time}</div>
            </div>
          ))}
          {typing && (
            <div style={{
              padding: '10px 15px',
              borderRadius: '15px',
              background: '#e9ecef',
              color: '#666',
              fontSize: '14px'
            }}>
              Escribiendo...
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '15px',
          borderTop: '1px solid #eee'
        }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu mensaje..."
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '25px',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
      )}

      <h3 style={{ marginTop: '2rem' }}>O contáctanos por WhatsApp</h3>
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