import './styles/global.css';
import { getTutores, getEventos, sendAppointmentRequest } from './services/googleApi.js';
import { initScrollAnimations } from './utils/animations.js';
import { createTutorCard } from './components/TutorCard.js';
import { createAppointmentModal } from './components/AppointmentModal.js';
import { initChatbot } from './components/Chatbot.js';

// Importación de Assets para Vite
import logoUac from './assets/logo-uac.png';
import logoEpmh from './assets/logo-epmh.png';
import headerBanner from './assets/header-logo-uac.png';
import flujoAtencion from './assets/flujo-atencion.png';
import logoFooter from './assets/logo-footer.png';

const app = document.querySelector('#app');

app.innerHTML = `
  <nav class="navbar reveal">
    <div class="logos-container">
      <img src="${logoUac}" alt="Logo UAC" class="nav-logo uac-logo">
      <div class="separator"></div>
      <img src="${logoEpmh}" alt="Logo EPMH" class="nav-logo epmh-logo">
      <span class="nav-title">Tutoría EPMH</span>
    </div>
    <div class="links">
      <a href="#flujo" class="nav-link">Ruta de Atención</a>
      <a href="#tutores" class="nav-link">Directorio</a>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-content reveal">
      <span class="badge"><i class="ph ph-shield-check" style="vertical-align: middle; margin-right: 5px;"></i> Área de Tutoría y Bienestar</span>
      <h1>Ecosistema Digital de Tutoría</h1>
      <p>Un acompañamiento institucional diseñado para mitigar el desgaste, orientar tu trayectoria clínica y respaldar tu éxito académico.</p>
    </div>
  </header>

  <section class="info-section">
    <div class="section-header reveal">
      <h2>Fundamentos del SITAP</h2>
      <p>Más que un sistema de apoyo, es una arquitectura formativa paralela a la enseñanza, basada en el Modelo Humanista-Constructivista.</p>
    </div>
    <div class="info-grid">
      <div class="info-card reveal"><i class="ph-fill ph-shield-warning"></i><h3>Prevención del Riesgo</h3><p>Identificación temprana y rescate de estudiantes al borde de la triple desaprobación.</p></div>
      <div class="info-card reveal"><i class="ph-fill ph-users-three"></i><h3>Desarrollo Integral</h3><p>Fomento de la ética profesional y manejo del estrés clínico.</p></div>
      <div class="info-card reveal"><i class="ph-fill ph-plant"></i><h3>Gestión Ecoeficiente</h3><p>Digitalización alineada al plan de sostenibilidad ambiental de la EPMH.</p></div>
    </div>
  </section>

  <div class="banner-container reveal">
    <img src="${headerBanner}" alt="Banner UAC" class="full-width-banner">
  </div>

  <section id="flujo" class="flujo-section">
    <div class="section-header reveal">
      <h2>Ruta de Atención Institucional</h2>
      <p>Conoce los pasos y niveles de derivación dentro del Sistema Institucional de Tutoría y Atención Psicopedagógica.</p>
    </div>
    <div class="infografia-container reveal">
      <img src="${flujoAtencion}" alt="Flujo de Atención SITAP" class="infografia-img">
    </div>
  </section>

  <section id="eventos" style="background-color: var(--bg-light); padding-top: 5rem; padding-bottom: 5rem;">
      <div class="section-header reveal">
        <h2>Noticias y Capacitaciones</h2>
        <p>Entérate de las próximas charlas, talleres de salud mental y eventos de la EPMH.</p>
      </div>
      
      <div class="carousel-wrapper reveal">
        <button class="carousel-btn prev-btn" id="prev-evento"><i class="ph-bold ph-caret-left"></i></button>
        
        <div id="eventos-track" class="carousel-track">
          </div>
        
        <button class="carousel-btn next-btn" id="next-evento"><i class="ph-bold ph-caret-right"></i></button>
      </div>
    </section>

  <section id="tutores" style="background-color: var(--white); padding-top: 5rem; padding-bottom: 5rem;">
    <div class="section-header reveal">
      <h2>Directorio Institucional</h2>
      <p>Conoce a los docentes encargados del acompañamiento y sus horarios de disponibilidad.</p>
    </div>
    
    <div id="tutores-container" class="tutores-grid" style="max-width: 1200px; margin: 0 auto; padding: 0 5%;">
      <p id="loading-text" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="ph ph-circle-notch ph-spin" style="font-size: 2.5rem; color: var(--uac-blue); margin-bottom: 1rem; display: inline-block;"></i><br>
        Sincronizando datos con la base institucional...
      </p>
    </div>
  </section>

  <footer class="main-footer">
    <div class="footer-content reveal">
      <img src="${logoFooter}" alt="UAC Footer" class="footer-logo">
      <div class="footer-text">
        <p><strong>Escuela Profesional de Medicina Humana</strong></p>
        <p>Universidad Andina del Cusco - Sabiduría que vive en ti.</p>
      </div>
    </div>
  </footer>
`;

// Lógica para renderizar los tutores desde Google Sheets utilizando el componente
async function renderizarTutores() {
  const container = document.getElementById('tutores-container');
  const tutores = await getTutores();

  if (tutores.length === 0) {
    container.innerHTML = '<p style="color: var(--epmh-red); text-align: center; grid-column: 1/-1;">No se pudieron cargar los datos. Verifica tu conexión a la red.</p>';
    return;
  }

  container.innerHTML = ''; 

  tutores.forEach((tutor, index) => {
    const cardElement = createTutorCard(tutor, index);
    container.appendChild(cardElement);
  });

  // ASIGNAR EVENTOS A LOS BOTONES DE AGENDAR CITA
  const actionButtons = container.querySelectorAll('.agendar-cita-btn');
  actionButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const tutorSeleccionado = tutores[index];
      
      const modalElement = createAppointmentModal(tutorSeleccionado, async (formData) => {
        return await sendAppointmentRequest(formData);
      });
      
      document.body.appendChild(modalElement);
    });
  });

  initScrollAnimations();
}

// Lógica para renderizar los eventos en formato Carrusel con Efectos de Transición
async function renderizarEventos() {
  const track = document.getElementById('eventos-track');
  const eventos = await getEventos();

  if (eventos.length === 0) {
    track.innerHTML = '<p style="text-align: center; color: var(--text-muted); width: 100%;">No hay eventos programados en este momento.</p>';
    return;
  }

  track.innerHTML = '';

  const imagenesPorDefecto = [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=600&q=80'
  ];

  eventos.forEach((evento, index) => {
    const card = document.createElement('div');
    card.className = 'evento-card'; 
    
    let imagenUrl = evento.imagen_url;
    if (!imagenUrl || imagenUrl.includes('placeholder.com') || imagenUrl.includes('placehold.co')) {
      imagenUrl = imagenesPorDefecto[index % imagenesPorDefecto.length];
    }

    let fechaFormateada = evento.fecha;
    const dateObj = new Date(evento.fecha);
    if (!isNaN(dateObj.getTime())) { 
      fechaFormateada = dateObj.toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    card.innerHTML = `
      <div class="evento-img-container">
        <img src="${imagenUrl}" alt="${evento.titulo}" class="evento-img" loading="lazy">
        <div class="evento-fecha-badge">
          <i class="ph-fill ph-calendar"></i> 
          <span class="badge-text">${fechaFormateada}</span>
        </div>
      </div>
      <div class="evento-content">
        <h3>${evento.titulo}</h3>
        <p class="evento-lugar"><i class="ph-fill ph-map-pin"></i> ${evento.lugar}</p>
        <p class="evento-desc">${evento.descripcion}</p>
      </div>
    `;
    track.appendChild(card);
  });

  // --- NUEVA LÓGICA: INTERSECTION OBSERVER PARA TRANSICIONES ---
  // Creamos un "vigilante" que detecta cuando las tarjetas entran en la pantalla
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si al menos el 50% de la tarjeta es visible, le da la clase activa
        entry.target.classList.add('active-slide');
      } else {
        // Si sale de la pantalla, se la quita para que vuelva a encogerse
        entry.target.classList.remove('active-slide');
      }
    });
  }, {
    root: track,
    threshold: 0.5 // Se activa cuando la tarjeta es visible a la mitad
  });

  // Le decimos al vigilante que observe todas las tarjetas generadas
  track.querySelectorAll('.evento-card').forEach(card => observer.observe(card));


  // --- FUNCIONAMIENTO DE LAS FLECHAS ---
  const prevBtn = document.getElementById('prev-evento');
  const nextBtn = document.getElementById('next-evento');
  const scrollAmount = 340; 
  
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  initScrollAnimations();
}
// Inicialización de todos los módulos del ecosistema
initScrollAnimations();
renderizarTutores();
renderizarEventos();
initChatbot();