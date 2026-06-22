// /src/components/TutorCard.js

export function createTutorCard(tutor, index) {
  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  
  const horariosHTML = dias
    .filter(dia => tutor[dia] && tutor[dia] !== "")
    .map(dia => `<li><strong>${dia.charAt(0).toUpperCase() + dia.slice(1)}</strong> <span>${tutor[dia]}</span></li>`)
    .join('');

  const card = document.createElement('div');
  card.className = 'tutor-card reveal';
  card.style.transitionDelay = `${(index % 3) * 100}ms`; 
  
  card.innerHTML = `
    <h3>${tutor.nombre}</h3>
    <p class="cargo">${tutor.cargo}</p>
    <div class="contacto">
      <p><i class="ph-fill ph-envelope-simple"></i> ${tutor.correo || 'No registrado'}</p>
      <p><i class="ph-fill ph-phone"></i> ${tutor.telefono || 'No registrado'}</p>
      <p><i class="ph-fill ph-map-pin"></i> ${tutor.oficina || 'Por asignar'}</p>
    </div>
    <div class="horarios">
      <h4>Horarios de Atención:</h4>
      <ul>${horariosHTML || '<li><strong>General</strong><span>Previa coordinación</span></li>'}</ul>
    </div>
    <button class="agendar-cita-btn" data-tutor-id="${index}">
      <i class="ph-fill ph-calendar-blank"></i> Agendar Cita
    </button>
  `;
  
  return card;
}