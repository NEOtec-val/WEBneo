import { useState, useEffect, useRef } from 'react';
/* eslint-disable no-unused-vars */
import { useCart } from '../context/useCart';

// Simulated AI responses - works immediately without API
const AI_RESPONSES = {
  // Laptop problems
  'no enciende laptop': '❓ *PARA LAPTOP:*\n\n1. ¿Las luces LED de carga encienden?\n2. ¿Oyes algún pitido o ruido?\n3. ¿La batería está cargada?\n\nResponde las 3 preg.',
  'pantalla negra': '❓ *PREGUNTAS:*\n\n1. ¿Visibleces las luces LED?\n2. ¿Conectando monitor externo funciona?\n3. ¿Escuchas el disco o ventilador?\n\nResponde.',
  'se calienta': '❓ *PREGUNTAS:*\n\n1. ¿El ventilador hace ruido fuerte?\n2. ¿Lo usas sobre cama/blanda?\n3. ¿Desde siempre o reciente?\n\nResponde.',
  'bateria': '❓ *PREGUNTAS:*\n\n1. ¿Cuántos años tiene la batería?\n2. ¿Cuánto dura la carga (minutos)?\n3. ¿Está hinchada?\n\nResponde.',
  'touchpad': '❓ *PREGUNTAS:*\n\n1. ¿Responde alguna vez?\n2. ¿Mouse externo funciona?\n3. ¿Presionaste Fn + touchpad?\n\nResponde.',
  'sonido': '❓ *PREGUNTAS:*\n\n1. ¿El icono de sonido aparece?\n2. ¿Probaste con audífonos?\n3. ¿Subiste el volumen?\n\nResponde.',
  'teclado': '❓ *PREGUNTAS:*\n\n1. ¿Algunas teclas funcionan?\n2. ¿Conectando teclado USB?\n3. ¿Problema en todas las teclas?\n\nResponde.',
  'virus': '❓ *PREGUNTAS:*\n\n1. ¿Qué antivirus tienes?\n2. ¿Cuándo fue el último scan?\n3. ¿Qué síntoma ves?\n\nResponde.',
  // PC problems
  'no enciende pc': '❓ *PARA PC:*\n\n1. ¿Las luces del motherboard encienden?\n2. ¿El ventilador PSU gira?\n3. ¿Oyes pitidos (cuántos)?\n\nResponde.',
  'pantalla pc': '❓ *PREGUNTAS:*\n\n1. ¿El monitor tiene luz LED?\n2. ¿Probaste otro cable HDMI?\n3. ¿En otro monitor funciona?\n\nResponde.',
  'ruido': '❓ *PREGUNTAS:*\n\n1. ¿El ruido viene del disco o ventilador?\n2. ¿Es continuo o intermitente?\n3. ¿Ruido tipo clic-clic?\n\nResponde.',
  // Printer problems
  'no imprime': '❓ *PARA IMPRESORA:*\n\n1. ¿Qué marca y modelo?\n2. ¿LEDs parpadean o están fijas?\n3. ¿Conectada por USB o WiFi?\n\nResponde.',
  'atasco': '❓ *PREGUNTAS:*\n\n1. ¿El atasco es al inicio o final de página?\n2. ¿Qué tipo de papel usas?\n3. ¿Abriste la puerta de atrás?\n\nResponde.',
  'calidad': '❓ *PREGUNTAS:*\n\n1. ¿Cuánto tiempo tiene la impresora?\n2. ¿Hiciste limpieza de cabezales?\n3. ¿Sale manchado o rayado?\n\nResponde.',
  // WiFi/Network
  'wifi': '❓ *PREGUNTAS:*\n\n1. ¿Otras redes WiFi funcionan?\n2. ¿El icono WiFi aparece?\n3. ¿Reiniciaste el router?\n\nResponde.',
  // General problems
  'lento': '❓ *PREGUNTAS:*\n\n1. ¿Cuántos años tiene el equipo?\n2. ¿Cuánta RAM tienes (4/8/16GB)?\n3. ¿Tienes antivirus?\n\nResponde.',
  'pantalla': '❓ *PREGUNTAS:*\n\n1. ¿El monitor tiene luz LED?\n2. ¿Probaste otro cable HDMI?\n3. ¿En otro monitor funciona?\n\nResponde.',
  // Installation tutorials
  'instalar hp': '📖 *INSTALAR HP*\n\n*USB:*\n1. Conecta USB, enciende\n2. Inicio > Config > Dispositivos\n3. Agregar impresora\n\n*WiFi:*\n1. Panel > WiFi > tu red\n2. Contraseña\n3. En PC, agregar\n\n⭐ HP Smart: hp.com/go/smart',
  'instalar epson': '📖 *INSTALAR EPSON*\n\n*USB:*\n1. Conecta USB, enciende\n2. Descarga driver epson.com\n3. Ejecuta instalador\n\n*WiFi:*\n1. Config > Red/WiFi\n2. Tu red + contraseña\n3. Agregar en PC',
  'instalar canon': '📖 *INSTALAR CANON*\n\n*USB:*\n1. Conecta USB\n2. canon.com/support\n3. Descarga driver\n\n*WiFi:*\n1. Mantén presionado WiFi\n2. Conecta a Canon_XXXXX\n3. Configura tu red',
  'driver': '📖 *ACTUALIZAR DRIVER*\n\n1. Ve a página oficial\n2. Busca tu modelo\n3. Descarga último driver\n4. Desinstala anterior\n5. Reinicia PC\n6. Instala nuevo',
  // Tutorials
  'tutorial': '📖 *TUTORIALES:*\n\n• Instalar HP\n• Instalar Epson\n• Instalar Canon\n• Actualizar driver\n• Configurar WiFi\n\n¿Cuál necesitas?',
  'como instalar': '📖 *TUTORIALES:*\n\n• Instalar HP\n• Instalar Epson\n• Instalar Canon\n• Actualizar driver\n• Configurar WiFi\n\n¿Cuál necesitas?',
  // Default
  'default': '👋 ¡Hola! Soy el asistente de NEOtec.\n\n💻 *Puedo ayudarte con:*\n- Laptop/PC no enciende\n- Equipos lentos\n- Instalar impresoras (HP, Epson, Canon)\n- WiFi, redes\n- Virus, virus\n- Y más...\n\n💬 Describe tu problema:'
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  
  // Check each keyword in order
  const keywords = [
    'no enciende', 'pantalla negra', 'se calienta', 'bateria', 'touchpad', 'sonido', 'teclado', 'virus',
    'wifi', 'lento', 'impresora', 'instalar', 'driver', 'tutorial', 'como instalar'
  ];
  
  // Check laptop specific first
  if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('macbook')) {
    if (lower.includes('no enciende')) return AI_RESPONSES['no enciende laptop'];
    if (lower.includes('pantalla')) return AI_RESPONSES['pantalla'];
    if (lower.includes('calient')) return AI_RESPONSES['se calienta'];
    if (lower.includes('bateria')) return AI_RESPONSES['bateria'];
    if (lower.includes('touchpad') || lower.includes('mouse')) return AI_RESPONSES['touchpad'];
    if (lower.includes('sonid') || lower.includes('audio')) return AI_RESPONSES['sonido'];
    if (lower.includes('teclad')) return AI_RESPONSES['teclado'];
    if (lower.includes('virus') || lower.includes('malware')) return AI_RESPONSES['virus'];
    if (lower.includes('lento')) return AI_RESPONSES['lento'];
    if (lower.includes('wifi')) return AI_RESPONSES['wifi'];
    return AI_RESPONSES['default'];
  }
  
  // Check PC specific
  if (lower.includes('pc') || lower.includes('computadora') || lower.includes('escritorio') || lower.includes('desktop')) {
    if (lower.includes('no enciende')) return AI_RESPONSES['no enciende pc'];
    if (lower.includes('pantalla')) return AI_RESPONSES['pantalla pc'];
    if (lower.includes('ruid')) return AI_RESPONSES['ruido'];
    if (lower.includes('wifi')) return AI_RESPONSES['wifi'];
    if (lower.includes('lento')) return AI_RESPONSES['lento'];
    return AI_RESPONSES['default'];
  }
  
  // Check printer
  if (lower.includes('impresora') || lower.includes('print')) {
    if (lower.includes('no imprime')) return AI_RESPONSES['no imprime'];
    if (lower.includes('atasco')) return AI_RESPONSES['atasco'];
    if (lower.includes('calid')) return AI_RESPONSES['calidad'];
    if (lower.includes('hp')) return AI_RESPONSES['instalar hp'];
    if (lower.includes('epson')) return AI_RESPONSES['instalar epson'];
    if (lower.includes('canon')) return AI_RESPONSES['instalar canon'];
    if (lower.includes('driver') || lower.includes('instala')) return AI_RESPONSES['driver'];
    return AI_RESPONSES['no imprime'];
  }
  
  // Check specific keywords
  for (const key of keywords) {
    if (lower.includes(key)) {
      return AI_RESPONSES[key] || AI_RESPONSES['default'];
    }
  }
  
  return AI_RESPONSES['default'];
}

const USE_STATIC_AI = true; // Set to false when API works

function getSessionId() {
  const stored = localStorage.getItem('neotec_session_id');
  if (stored) return stored;
  const newId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('neotec_session_id', newId);
  return newId;
}

export default function Soporte() {
  const [form, setForm] = useState({ nombre: '', email: '', problema: '' });
  const [enviado, setEnviado] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => getSessionId());
  const lastReplyRef = useRef(null);

  useEffect(() => {
    setMessages([{ 
      type: 'bot', 
      text: '👋 ¡Hola! Soy el asistente de NEOtec Soporte Técnico.\n\n💻 ¿En qué puedo ayudarte hoy?\n- Problemas con laptop/PC\n- Instalación de impresoras\n- WiFi, redes\n- Y más...',
      time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const resp = await fetch(`${API_URL}/${sessionId}?t=${Date.now()}`);
        const data = await resp.json();
        if (data.response && data.hasReply && data.response !== lastReplyRef.current) {
          lastReplyRef.current = data.response;
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
    
    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getAIResponse(userMsg);
      setTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text: response, time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
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