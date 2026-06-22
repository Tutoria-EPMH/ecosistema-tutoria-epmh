// /src/components/AppointmentModal.js

export function createAppointmentModal(tutor, onFormSubmit) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3>Gestionar Cita de Acompañamiento</h3>
        <button class="close-modal-btn"><i class="ph ph-x"></i></button>
      </div>
      <div class="modal-body">
        <p class="modal-target-text">Tutor seleccionado: <strong>${tutor.nombre}</strong></p>
        
        <div class="appointment-option-box whatsapp-box">
          <div class="option-info">
            <h4><i class="ph-fill ph-whatsapp-logo"></i> Coordinación Rápida por WhatsApp</h4>
            <p>Envía un mensaje instantáneo directamente al terminal del docente tutor.</p>
          </div>
          <a href="https://wa.me/51${tutor.telefono}?text=Hola%20%20${encodeURIComponent(tutor.nombre)}%2C%20le%20saluda%20un%20estudiante%20de%20la%20EPMH.%20Desear%C3%ADa%20coordinar%20una%20sesi%C3%B3n%20de%20tutor%C3%ADa." 
             target="_blank" class="whatsapp-action-btn">
            Iniciar Chat
          </a>
        </div>

        <div class="modal-divider"><span>O BIEN</span></div>

        <form id="appointment-formal-form" class="appointment-form">
          <h4><i class="ph-fill ph-envelope-open"></i> Solicitud Formal por Correo</h4>
          <p class="option-desc">Registra tus datos institucionales para enviar una notificación directa a la bandeja de entrada del docente con copia a tu correo.</p>
          
          <div class="form-group">
            <label for="student-name">Nombres y Apellidos del Estudiante</label>
            <input type="text" id="student-name" required placeholder="Ej. Juan Pérez">
          </div>
          <div class="form-group">
            <label for="student-code">Código Universitario UAC</label>
            <input type="text" id="student-code" required placeholder="Ej. 021100254">
          </div>
          <div class="form-group">
            <label for="student-email">Correo Institucional UAC</label>
            <input type="email" id="student-email" required placeholder="Ej. 021100254@uandina.edu.pe">
          </div>
          <div class="form-group">
            <label for="appointment-reason">Motivo Académico o Psicopedagógico</label>
            <textarea id="appointment-reason" required placeholder="Detalla brevemente el soporte que requieres..."></textarea>
          </div>
          
          <button type="submit" class="submit-form-btn">
            <span class="btn-text">Enviar Solicitud Formal</span>
            <span class="btn-spinner hidden"><i class="ph ph-circle-notch ph-spin"></i></span>
          </button>
        </form>
      </div>
    </div>
  `;

  const closeBtn = modal.querySelector('.close-modal-btn');
  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  const form = modal.querySelector('#appointment-formal-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Capturamos los valores y usamos .trim() para eliminar espacios accidentales al inicio o final
    const estudianteVal = form.querySelector('#student-name').value.trim();
    const codigoVal = form.querySelector('#student-code').value.trim();
    const correoVal = form.querySelector('#student-email').value.trim().toLowerCase(); // Convertimos a minúsculas
    const motivoVal = form.querySelector('#appointment-reason').value.trim();

    // --- 1. VALIDACIÓN DEL DOMINIO INSTITUCIONAL ---
    if (!correoVal.endsWith('@uandina.edu.pe')) {
      alert('⚠️ Error de Validación:\nPor favor, utiliza un correo institucional válido que termine exactamente en "@uandina.edu.pe".\nRevisa que no haya errores tipográficos.');
      return; // Detiene la ejecución para no enviar datos erróneos
    }

    // --- 2. VALIDACIÓN DEL CÓDIGO (Solo números) ---
    // Usamos una expresión regular para asegurar que solo contenga dígitos
    if (!/^\d+$/.test(codigoVal)) {
      alert('⚠️ Error de Validación:\nEl código universitario solo debe contener números, sin letras ni espacios.');
      return; // Detiene la ejecución
    }

    // Si las validaciones pasan, procedemos con el estado de carga visual
    const submitBtn = form.querySelector('.submit-form-btn');
    const text = form.querySelector('.btn-text');
    const spinner = form.querySelector('.btn-spinner');
    
    submitBtn.disabled = true;
    text.textContent = "Procesando envío...";
    spinner.classList.remove('hidden');

    const formData = {
      estudiante: estudianteVal,
      codigo: codigoVal,
      correoEstudiante: correoVal,
      motivo: motivoVal,
      correoTutor: tutor.correo,
      nombreTutor: tutor.nombre
    };

    const success = await onFormSubmit(formData);

    if (success) {
      modal.remove();
      alert('✅ Solicitud enviada con éxito. Revisa tu bandeja de entrada para ver la copia de seguridad.');
    } else {
      submitBtn.disabled = false;
      text.textContent = "Enviar Solicitud Formal";
      spinner.classList.add('hidden');
      alert('❌ Ocurrió un inconveniente de conexión. Intenta nuevamente o usa la opción de WhatsApp.');
    }
  });

  return modal;
}