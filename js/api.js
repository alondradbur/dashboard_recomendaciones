function mostrarSpinner() {
  $("#spinner").classList.remove("oculto");
  $("#errorCarga").classList.add("oculto");
}

function ocultarSpinner() {
  $("#spinner").classList.add("oculto");
}

function mostrarError(mensaje) {
  const card = $("#errorCarga");
  card.querySelector("p").textContent = mensaje;
  card.classList.remove("oculto");
}

async function cargarDatos() {
  mostrarSpinner();
  try {
    const respuesta = await fetch(APPS_SCRIPT_URL);
    const json = await respuesta.json();
    DATOS_CRUDOS = (json.datos || []).map(normalizarRegistro);
    ULTIMA_ACTUALIZACION = json.actualizado || new Date().toISOString();
    ocultarSpinner();
    inicializarDashboard();
  } catch (error) {
    ocultarSpinner();
    mostrarError("No se pudo conectar con Google Sheets. Verifica tu conexión a internet.");
    console.error("Error al cargar datos:", error);
  }
}

function normalizarRegistro(registro) {
  return {
    ejercicio_fiscal: numero(registro.ejercicio_fiscal),
    id2: registro.id2 || "",
    etapa: registro.etapa || obtenerEtapa(registro),
    numero_resultado: registro.numero_resultado || "",
    tipo_recomendacion: registro.tipo_recomendacion || "",
    no_acciones: numero(registro.no_acciones),
    acciones_detalle: registro.acciones_detalle || "",
    estatus: String(registro.estatus || "").toUpperCase(),
    acciones_atendidas: numero(registro.acciones_atendidas),
    acciones_pendientes: numero(registro.acciones_pendientes),
    prioridad: String(registro.prioridad || "N/A").toUpperCase(),
    analisis_recomendacion: registro.analisis_recomendacion || ""
  };
}
