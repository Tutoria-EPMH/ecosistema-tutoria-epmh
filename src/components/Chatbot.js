// /src/components/Chatbot.js

export function initChatbot() {
  // 1. Base de Conocimientos (Motor Heurístico Ampliado)
  const knowledgeBase = [
    {
      id: 'saludo',
      keywords: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'saludos', 'hey'],
      response: '¡Hola! 👋 Soy el asistente virtual del Sistema Institucional de Tutoría (SITAP) de la EPMH. ¿En qué te puedo ayudar hoy?'
    },
    {
      id: 'beneficios',
      keywords: ['beneficio', 'ventaja', 'ayuda', 'sirve', 'importante', 'para que', 'objetivo'],
      response: 'La tutoría está diseñada para mitigar tu desgaste y respaldar tu éxito académico. Los beneficios incluyen: mejorar tus notas, prevenir el Riesgo Trica, recibir orientación para el Internado Médico y contar con apoyo emocional para manejar el estrés de la carrera.'
    },
    {
      id: 'confidencialidad',
      keywords: ['confidencial', 'privado', 'secreto', 'seguro', 'privacidad', 'enterar', 'datos', 'anonimo'],
      response: 'Absolutamente. Toda la información tratada en la Tutoría de Formación es estrictamente confidencial. El manejo de tu información personal y académica es un imperativo ético y legal de la UAC, enfocado únicamente en tu bienestar.'
    },
    {
      id: 'derivacion',
      keywords: ['psicologo', 'psicologia', 'derivar', 'derivacion', 'terapia', 'centro medico', 'clinica', 'especialista'],
      response: 'El flujo de atención del SITAP indica que, si tu Tutor de Formación identifica que requieres atención especializada, realizará una derivación confidencial a los Programas de apoyo socioemocional de la UAC o a especialistas externos para que recibas terapia profesional.'
    },
    {
      id: 'cita',
      keywords: ['cita', 'agendar', 'reunion', 'hablar', 'contacto', 'whatsapp', 'correo', 'reservar'],
      response: 'Para agendar una cita, dirígete a la sección "Directorio Institucional" al final de esta página. Haz clic en "Agendar Cita" bajo el perfil de tu tutor. Podrás elegir entre un contacto rápido por WhatsApp o una solicitud formal por correo institucional.'
    },
    {
      id: 'trica',
      keywords: ['trica', 'riesgo', 'tercera', 'desaprobado', 'jalado', 'expulsion', 'separacion', 'formato 9'],
      response: 'El "Riesgo Trica" ocurre al estar cerca de desaprobar una materia por tercera vez. El SITAP utiliza el Formato N° 9 para identificar estos casos tempranamente. Si estás en esta situación, agenda una cita urgente con tu Tutor de Formación.'
    },
    {
      id: 'academica',
      keywords: ['curso', 'nota', 'examen', 'recuperacion', 'duda', 'anatomia', 'fisiologia', 'academica', 'art 17', 'teoria'],
      response: 'La Tutoría Académica resuelve dudas específicas de tus cursos. Además, según el Art. 17, tienes derecho a solicitar una recuperación. Debes coordinar directamente con el docente de tu asignatura clínica o de ciencias básicas.'
    },
    {
      id: 'formativa',
      keywords: ['formativa', 'estres', 'ansiedad', 'problemas', 'desgaste', 'burnout', 'mental', 'emocional'],
      response: 'La Tutoría de Formación te brinda acompañamiento psicopedagógico. Si sientes desgaste, estrés clínico o problemas personales, nuestros tutores designados están capacitados para brindarte contención y guiarte.'
    }
  ];

  // Añadimos nuevas opciones por defecto al menú rápido
  const defaultOptions = [
    { text: "¿Cómo agendar una cita?", intent: 'cita' },
    { text: "¿Es confidencial?", intent: 'confidencialidad' },
    { text: "¿Dan apoyo psicológico?", intent: 'derivacion' },
    { text: "¿Qué es el Riesgo Trica?", intent: 'trica' }
  ];

  // 2. Inyección de la UI en el DOM
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'sitap-chatbot';
  chatbotContainer.innerHTML = `
    <button id="chatbot-toggle-btn" class="chatbot-fab">
      <i class="ph-fill ph-chat-teardrop-text"></i>
    </button>

    <div id="chatbot-window" class="chatbot-window hidden-chat">
      <div class="chat-header">
        <div class="chat-title">
          <i class="ph-fill ph-robot"></i>
          <div>
            <h4>Asistente SITAP</h4>
            <span>En línea</span>
          </div>
        </div>
        <button id="chat-close-btn"><i class="ph ph-x"></i></button>
      </div>
      
      <div id="chat-messages" class="chat-messages">
        <div class="message bot-message">
          <p>Hola, soy el asistente virtual de la EPMH. ¿En qué te puedo orientar hoy?</p>
        </div>
        ${renderOptions(defaultOptions)}
      </div>

      <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Escribe tu consulta aquí..." autocomplete="off">
        <button id="chat-send-btn"><i class="ph-fill ph-paper-plane-right"></i></button>
      </div>
    </div>
  `;

  document.body.appendChild(chatbotContainer);

  // 3. Lógica de Interacción
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chatbot-window');
  const inputField = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messagesContainer = document.getElementById('chat-messages');

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.remove('hidden-chat');
    toggleBtn.classList.add('hidden-chat');
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden-chat');
    toggleBtn.classList.remove('hidden-chat');
  });

  // Procesar entrada de texto
  function processUserInput(text) {
    // Limpiamos el texto: a minúsculas, sin tildes ni caracteres especiales
    const lowerText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    let matchedIntent = null;

    // Buscamos coincidencias de palabras clave usando expresiones para evitar falsos positivos
    for (const intent of knowledgeBase) {
      if (intent.keywords.some(keyword => {
        // Expresión regular para encontrar la palabra exacta (evita que "cita" se active si escribes "capacitacion")
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        return regex.test(lowerText);
      })) {
        matchedIntent = intent;
        break; // Detenemos la búsqueda al encontrar la primera coincidencia
      }
    }

    // Retardo simulado de "escribiendo..."
    setTimeout(() => {
      if (matchedIntent) {
        addMessage(matchedIntent.response, 'bot');
      } else {
        // Fallback robusto si no entiende
        addMessage('No logré comprender tu consulta con exactitud. Por favor, reformula tu pregunta utilizando palabras más simples, o selecciona una de las opciones frecuentes:', 'bot');
        const optionsHtml = renderOptions(defaultOptions);
        messagesContainer.insertAdjacentHTML('beforeend', optionsHtml);
        attachOptionListeners();
        scrollToBottom();
      }
    }, 600);
  }

  function handleSend() {
    const text = inputField.value.trim();
    if (text === '') return;

    addMessage(text, 'user');
    inputField.value = '';
    processUserInput(text);
  }

  sendBtn.addEventListener('click', handleSend);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Utilidades de UI
  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
  }

  function renderOptions(options) {
    let html = `<div class="chat-options">`;
    options.forEach(opt => {
      html += `<button class="chat-option-btn" data-intent="${opt.intent}">${opt.text}</button>`;
    });
    html += `</div>`;
    return html;
  }

  function attachOptionListeners() {
    const optionBtns = document.querySelectorAll('.chat-option-btn:not(.bound)');
    optionBtns.forEach(btn => {
      btn.classList.add('bound'); 
      btn.addEventListener('click', () => {
        const intentId = btn.getAttribute('data-intent');
        const intentData = knowledgeBase.find(k => k.id === intentId);
        
        addMessage(btn.textContent, 'user'); 
        
        setTimeout(() => {
          addMessage(intentData.response, 'bot');
        }, 500);
      });
    });
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  attachOptionListeners();
}