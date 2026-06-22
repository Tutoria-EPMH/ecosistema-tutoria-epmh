// Reemplazamos con tu URL exacta
const API_URL = 'https://script.google.com/macros/s/AKfycbxHrxq_rNqLCuIQ7XXg95h2VJp7ByHzO6OsYn0tMMWmeB8M6h7xpp-axqA-ViMIbEIXXA/exec';

// Constantes para la gestión del caché
const CACHE_KEY = 'epmh_tutores_data';
const CACHE_TIME_KEY = 'epmh_tutores_timestamp';
const CACHE_DURATION = 0; // 0 para desarrollo (cámbialo a 1000 * 60 * 60 en producción)

// 1. FUNCIÓN MAESTRA: Descarga tanto tutores como eventos al mismo tiempo
export async function fetchData() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

  if (cachedData && cachedTime) {
    const age = Date.now() - parseInt(cachedTime, 10);
    if (age < CACHE_DURATION) {
      console.log('Carga instantánea: Leyendo datos desde el caché local.');
      return JSON.parse(cachedData);
    }
  }

  try {
    console.log('Obteniendo datos frescos desde el servidor (Tutores y Eventos)...');
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error de red');
    const data = await response.json();
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    return data;
  } catch (error) {
    console.error('Error:', error);
    if (cachedData) {
      console.warn('Sin conexión. Retornando datos del caché antiguo.');
      return JSON.parse(cachedData);
    }
    return { tutores: [], eventos: [] }; // Retorna arrays vacíos si todo falla
  }
}

// 2. EXPORTACIÓN LIMPIA PARA TUTORES
export async function getTutores() {
  const data = await fetchData();
  return data.tutores || [];
}

// 3. EXPORTACIÓN LIMPIA PARA EVENTOS
export async function getEventos() {
  const data = await fetchData();
  return data.eventos || [];
}

// 4. FUNCIÓN PARA ENVIAR CORREOS DE CITAS
export async function sendAppointmentRequest(formData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      body: JSON.stringify(formData)
    });
    
    return true;
  } catch (error) {
    console.error("Error enviando datos del formulario:", error);
    return false;
  }
}