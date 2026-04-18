const BOT_TOKEN = '8464260860:AAFd_3NV49XbYo_QCby-ZipZYjmlBn5BGpE';
const ADMIN_CHAT_ID = '6861350112';
const sessions = new Map();

export async function onRequestPost(context) {
  const { request, env } = context;
  const data = await request.json();
  const { message, sessionId } = data;
  
  if (!message) {
    return new Response(JSON.stringify({ error: 'Message required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  let sessionData = sessions.get(sessionId);
  if (!sessionData) {
    sessionData = { id: sessionId, history: [], pendingReply: null };
    sessions.set(sessionId, sessionData);
  }
  
  try {
    const notifyResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: `🌐 *NUEVO MENSAJE WEB*\n\n💬: "${message}"\n\n🆔 Sesión: ${sessionId}\n\nResponde con: /reply ${sessionId} tu_respuesta`,
        parse_mode: 'Markdown'
      })
    });
    console.log('Telegram notification:', notifyResponse.ok);
  } catch (error) {
    console.error('Telegram error:', error);
  }
  
  const response = generateResponse(message);
  sessionData.history.push({ role: 'user', content: message });
  sessionData.history.push({ role: 'assistant', content: response });
  
  return new Response(JSON.stringify({
    response: response,
    sessionId: sessionId
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const sessionId = url.pathname.split('/api/chat/')[1]?.split('?')[0];
  
  if (!sessionId) {
    return new Response(JSON.stringify({ response: null, hasReply: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const sessionData = sessions.get(sessionId);
  const reply = sessionData?.pendingReply;
  
  if (reply) {
    delete sessionData.pendingReply;
    return new Response(JSON.stringify({ response: reply, hasReply: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ response: null, hasReply: false }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPut(context) {
  const { request } = context;
  const data = await request.json();
  
  if (data.message?.text?.startsWith('/reply')) {
    const parts = data.message.text.split(' ');
    parts.shift();
    const sessionId = parts[0];
    const replyMessage = parts.slice(1).join(' ');
    
    const sessionData = sessions.get(sessionId);
    if (sessionData) {
      sessionData.pendingReply = replyMessage;
      sessionData.history.push({ role: 'assistant', content: replyMessage });
      sessions.set(sessionId, sessionData);
      
      return new Response(JSON.stringify({ ok: true, message: 'Reply saved' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return new Response(JSON.stringify({ ok: false }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function generateResponse(message) {
  const lower = message.toLowerCase();
  
  const tutorials = {
    'instalar hp': '📖 *INSTALAR IMPRESORA HP*\n\n' +
      '*Por USB:*\n' +
      '1. Conecta el cable USB a la PC\n' +
      '2. Enciende la impresora\n' +
      '3. Ve a Inicio > Configuración > Dispositivos\n' +
      '4. Agregar impresora\n' +
      '5. Selecciona tu HP\n\n' +
      '*Por WiFi:*\n' +
      '1. En el panel, toca WiFi > Configuración\n' +
      '2. Selecciona tu red\n' +
      '3. Ingresa la contraseña\n' +
      '4. En la PC, agrega la impresora\n\n' +
      '⭐ Descarga HP Smart de hp.com/go/smart\n\n' +
      '📞 ¿Necesitas más ayuda? Escríbenos al WhatsApp.',
    
    'instalar epson': '📖 *INSTALAR IMPRESORA EPSON*\n\n' +
      '*Por USB:*\n' +
      '1. Conecta el cable USB\n' +
      '2. Enciende la impresora\n' +
      '3. Descarga driver de epson.com\n' +
      '4. Ejecuta el instalador\n\n' +
      '*Por WiFi:*\n' +
      '1. Ve a Configuración > Red/WiFi\n' +
      '2. Busca tu red WiFi\n' +
      '3. Ingresa la contraseña\n' +
      '4. Descarga driver de epson.com\n\n' +
      '📞 ¿Necesitas más ayuda?',
    
    'instalar canon': '📖 *INSTALAR IMPRESORA CANON*\n\n' +
      '*Por USB:*\n' +
      '1. Conecta el cable USB\n' +
      '2. Enciende la impresora\n' +
      '3. Ve a canon.com/support\n' +
      '4. Busca tu modelo\n' +
      '5. Descarga el driver\n\n' +
      '*Por WiFi:*\n' +
      '1. Mantén presionado botón WiFi\n' +
      '2. Cuando parpadee, suelta\n' +
      '3. Conecta a Canon_XXXXXX\n\n' +
      '📞 ¿Necesitas más ayuda?',
    
    'driver': '📖 *ACTUALIZAR DRIVER*\n\n' +
      '1. Ve a la página oficial (HP, Epson, etc.)\n' +
      '2. Busca tu modelo de impresora\n' +
      '3. Descarga el último driver\n' +
      '4. Desinstala el driver anterior\n' +
      '5. Reinicia la PC\n' +
      '6. Instala el nuevo driver\n\n' +
      '📞 ¿Necesitas más ayuda?',
  };
  
  for (const key in tutorials) {
    if (lower.includes(key)) {
      return tutorials[key];
    }
  }
  
  const problems = {
    'no enciende': '❓ *PARA AYUDARTE:*\n\n' +
      '1. ¿Las luces LED de carga encienden?\n' +
      '2. ¿Oyes algún pitido o ruido?\n' +
      '3. ¿La batería está cargada?\n\n' +
      'Responde las 3 preguntas.',
    
    'lento': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Cuántos años tiene el equipo?\n' +
      '2. ¿Cuánta RAM tienes (4/8/16GB)?\n' +
      '3. ¿Tienes antivirus?\n\n' +
      'Responde.',
    
    'wifi': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Otras redes WiFi funcionan?\n' +
      '2. ¿El icono WiFi aparece?\n' +
      '3. ¿Reiniciaste el router?\n\n' +
      'Responde.',
    
    'impresora': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Qué marca y modelo?\n' +
      '2. ¿LEDs parpadean o están fijas?\n' +
      '3. ¿Conectada por USB o WiFi?\n\n' +
      'Responde.',
    
    'pantalla': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿El monitor tiene luz LED?\n' +
      '2. ¿Probaste otro cable HDMI?\n' +
      '3. ¿En otro monitor funciona?\n\n' +
      'Responde.',
    
    'bateria': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Cuántos años tiene la batería?\n' +
      '2. ¿Cuánto dura la carga (minutos)?\n' +
      '3. ¿Está hinchada?\n\n' +
      'Responde.',
    
    'virus': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Qué antivirus tienes?\n' +
      '2. ¿Cuándo fue el último scan?\n' +
      '3. ¿Qué síntoma ves?\n\n' +
      'Responde.',
    
    'disco': '❓ *PREGUNTAS:*\n\n' +
      '1. ¿Tipo de disco (HDD/SSD)?\n' +
      '2. ¿Escuchas ruido extraño?\n' +
      '3. ¿El disco aparece en Mi PC?\n\n' +
      'Responde.',
  };
  
  for (const key in problems) {
    if (lower.includes(key)) {
      return problems[key];
    }
  }
  
  if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('macbook')) {
    return '💻 *CHAT DE LAPTOP*\n\n❓ ' +
      'Para ayudarte mejor:\n' +
      '1. ¿Qué problema tiene?\n' +
      '2. ¿Cuándo empezó?\n' +
      '3. ¿Hay mensaje de error?\n\n' +
      'Responde.';
  }
  
  if (lower.includes('pc') || lower.includes('computadora') || lower.includes('escritorio')) {
    return '🖥️ *CHAT DE PC*\n\n❓ ' +
      'Preguntas:\n' +
      '1. ¿Qué problema tiene?\n' +
      '2. ¿Cuándo empezó?\n' +
      '3. ¿Hay mensaje de error?\n\n' +
      'Responde.';
  }
  
  if (lower.includes('impresora') || lower.includes('print')) {
    return '🖨️ *CHAT DE IMPRESORA*\n\n❓ ' +
      'Preguntas:\n' +
      '1. ¿Qué marca y modelo?\n' +
      '2. ¿Qué problema tiene?\n' +
      '3. ¿LEDs parpadean?\n\n' +
      'Responde.';
  }
  
  if (lower.includes('tutorial') || lower.includes('cómo instalar') || lower.includes('como install')) {
    return '📖 *TUTORIALES DISPONIBLES:*\n\n' +
      '• Instalar impresORa HP\n' +
      '• Instalar impresORa Epson\n' +
      '• Instalar impresORa Canon\n' +
      '• Actualizar driver\n\n' +
      '¿Cuál necesitas?';
  }
  
  return '👋 ¡Hola! Soy el asistente de NEOtec Soporte Técnico.\n\n' +
    '💻 * Puedo ayudarte con:*\n' +
    '- Problemas con laptop/PC\n' +
    '- Instalación de impresoras\n' +
    '- WiFi, redes, virus\n' +
    '- Recuperación de datos\n' +
    '- Y más...\n\n' +
    '💬 ¿En qué puedo ayudarte hoy?';
}