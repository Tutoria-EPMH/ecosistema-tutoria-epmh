export function createQuejasModal(onSubmitCallback) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000;';

  const modal = document.createElement('div');
  modal.style.cssText = 'background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.2);';

  modal.innerHTML = `
    <button type="button" class="close-btn" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
    <h3 style="margin-top: 0; color: var(--uac-blue, #153268); border-bottom: 2px solid #eee; padding-bottom: 10px;">Buzón de Quejas</h3>
    <p style="font-size: 0.9rem; color: #555;">Este reporte es confidencial y será enviado directamente al área de Tutorías.</p>
    
    <form id="quejas-form" style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
      <div>
        <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Nombre Completo:</label>
        <input type="text" name="nombre" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" placeholder="Ej: Juan Pérez">
      </div>
      
      <div>
        <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Correo Institucional:</label>
        <input type="email" name="correo" required pattern="^[a-zA-Z0-9._%+-]+@uandina\\.edu\\.pe$" title="Debe utilizar su correo institucional terminado en @uandina.edu.pe" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" placeholder="usuario@uandina.edu.pe">
      </div>
      
      <div>
        <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Nombre del Docente:</label>
        <input type="text" name="docente" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
      </div>
      
      <div style="display: flex; gap: 15px;">
        <div style="flex: 2;">
          <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Curso que enseña:</label>
          <input type="text" name="curso" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        <div style="flex: 1;">
          <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Horario/Grupo:</label>
          <input type="text" name="horario" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" placeholder="Ej: 3A">
        </div>
      </div>
      
      <div>
        <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Tipo de Queja:</label>
        <select name="tipo_queja" id="tipo-queja-select" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; background: white;">
          <option value="" disabled selected>Selecciona el tipo de queja...</option>
          <optgroup label="Puntualidad y asistencia del docente">
            <option>Llega tarde a clase de forma frecuente</option>
            <option>Termina la clase antes de la hora</option>
            <option>Falta a clases sin avisar ni reponer la sesión</option>
            <option>No toma lista o no controla la asistencia</option>
            <option>Cancela clases sin justificación</option>
          </optgroup>
          <optgroup label="Trato y conducta">
            <option>Trato irrespetuoso, groserías o gritos</option>
            <option>Burlas, humillaciones o comentarios ofensivos</option>
            <option>Discriminación (por género, origen, religión, apariencia, orientación sexual, discapacidad, etc.)</option>
            <option>Acoso o comentarios inapropiados</option>
            <option>Favoritismo o trato desigual entre alumnos</option>
            <option>Uso excesivo del celular o distracciones durante la clase</option>
            <option>Presentarse bajo los efectos del alcohol u otras sustancias</option>
          </optgroup>
          <optgroup label="Desempeño académico y enseñanza">
            <option>No sigue el sílabo o los temas del curso</option>
            <option>Clases mal preparadas o improvisadas</option>
            <option>No explica con claridad ni resuelve dudas</option>
            <option>No usa la plataforma o los materiales acordados</option>
            <option>Material desactualizado o inexistente</option>
            <option>No respeta la modalidad de clase (presencial/virtual)</option>
          </optgroup>
          <optgroup label="Evaluación y calificaciones">
            <option>Calificaciones injustas o sin criterios claros</option>
            <option>No entrega las notas dentro del plazo</option>
            <option>No muestra ni retroalimenta los exámenes</option>
            <option>Cambia las reglas de evaluación a mitad del curso</option>
            <option>Evaluaciones que no corresponden a lo enseñado</option>
            <option>Negarse a revisar una nota cuando se solicita</option>
          </optgroup>
          <optgroup label="Comunicación y atención">
            <option>No responde correos o mensajes</option>
            <option>No cumple con horarios de asesoría o tutoría</option>
            <option>Falta de disposición para atender a los alumnos</option>
          </optgroup>
          <optgroup label="Integridad y ética">
            <option>Solicita dinero, favores o regalos</option>
            <option>Condiciona notas a favores personales</option>
            <option>Vende material, libros o apuntes de forma obligatoria</option>
            <option>Uso indebido de trabajos de los alumnos</option>
          </optgroup>
          <optgroup label="Otros">
            <option value="Otro">Otro (especificar)</option>
          </optgroup>
        </select>
        <input type="text" name="tipo_otro" id="tipo-otro-input" placeholder="Especifica el tipo de queja" style="display: none; width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; margin-top: 8px;">
      </div>

      <div>
        <label style="font-weight: bold; font-size: 0.9rem; color: #333;">Detalle de la Queja:</label>
        <textarea name="queja" required rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; resize: vertical;" placeholder="Describe detalladamente lo ocurrido..."></textarea>
      </div>
      
      <button type="submit" id="submit-queja-btn" style="background: #d32f2f; color: white; border: none; padding: 12px; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 10px;">
        Enviar Queja
      </button>
    </form>
  `;

  overlay.appendChild(modal);

  const closeBtn = modal.querySelector('.close-btn');
  const closeModal = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const form = modal.querySelector('#quejas-form');
  const submitBtn = modal.querySelector('#submit-queja-btn');

  // Mostrar el campo de texto solo cuando se elige "Otro (especificar)"
  const tipoSelect = modal.querySelector('#tipo-queja-select');
  const tipoOtroInput = modal.querySelector('#tipo-otro-input');
  tipoSelect.addEventListener('change', () => {
    const esOtro = tipoSelect.value === 'Otro';
    tipoOtroInput.style.display = esOtro ? 'block' : 'none';
    tipoOtroInput.required = esOtro;
    if (!esOtro) tipoOtroInput.value = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correoInput = form.correo.value.toLowerCase().trim();
    if (!correoInput.endsWith('@uandina.edu.pe')) {
      alert('Error: Debe utilizar un correo institucional válido (@uandina.edu.pe)');
      return;
    }

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    const formData = {
      nombre: form.nombre.value,
      correo: correoInput,
      docente: form.docente.value,
      curso: form.curso.value,
      horario: form.horario.value,
      tipo_queja: tipoSelect.value === 'Otro'
        ? 'Otro: ' + tipoOtroInput.value.trim()
        : tipoSelect.value,
      queja: form.queja.value
    };

    // try/catch: si el callback falla (red, ReferenceError, etc.) el botón nunca queda bloqueado
    let exito = false;
    try {
      const resultado = await onSubmitCallback(formData);
      // sendQuejaRequest devuelve { success: true/false }, por eso se revisa .success
      exito = !!resultado && resultado.success === true;
    } catch (error) {
      console.error('Error al enviar la queja:', error);
      exito = false;
    }

    if (exito) {
      modal.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 4rem; color: #4caf50; margin: 0;">&#10003;</h1>
          <h3 style="color: #333;">Queja enviada correctamente</h3>
          <p style="color: #666;">Tutorías ha recibido tu reporte de manera confidencial.</p>
          <button id="ok-btn" style="background: #153268; color: white; border: none; padding: 10px 20px; border-radius: 4px; margin-top: 20px; cursor: pointer;">Cerrar ventana</button>
        </div>
      `;
      modal.querySelector('#ok-btn').addEventListener('click', closeModal);
    } else {
      alert('Hubo un error al enviar la queja. Por favor, verifica tu conexión.');
      submitBtn.textContent = 'Enviar Queja';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

  return overlay;
}