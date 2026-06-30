function poblarFiltroEjercicios() {
  const select = $("#filtroEjercicio");
  const ejercicios = [...new Set(DATOS_CRUDOS.map(r => r.ejercicio_fiscal).filter(Boolean))].sort();
  select.innerHTML = '<option value="">Todos los ejercicios</option>';
  ejercicios.forEach(ejercicio => {
    select.insertAdjacentHTML("beforeend", `<option value="${ejercicio}">${ejercicio}</option>`);
  });
}

function aplicarFiltros() {
  const ejercicio = $("#filtroEjercicio").value;
  const etapa = $("#filtroEtapa").value;
  const estatus = $("#filtroEstatus").value;
  const prioridad = $("#filtroPrioridad").value;
  const texto = $("#filtroTexto").value.trim().toLowerCase();

  DATOS_FILTRADOS = DATOS_CRUDOS.filter(registro => {
    if (ejercicio && String(registro.ejercicio_fiscal) !== ejercicio) return false;
    if (etapa && obtenerEtapa(registro) !== etapa) return false;
    if (estatus && registro.estatus !== estatus) return false;
    if (prioridad && registro.prioridad !== prioridad) return false;
    if (texto && !textoRegistro(registro).includes(texto)) return false;
    return true;
  });

  actualizarBadgeFiltros();
  cerrarDrawerFiltros();
  actualizarDashboard();
}

function actualizarBadgeFiltros() {
  const activos = ["#filtroEjercicio", "#filtroEtapa", "#filtroEstatus", "#filtroPrioridad", "#filtroTexto"]
    .filter(id => $(id).value.trim() !== "").length;
  $("#badgeFiltros").textContent = activos ? activos : "";
}

function limpiarFiltros() {
  ["#filtroEjercicio", "#filtroEtapa", "#filtroEstatus", "#filtroPrioridad", "#filtroTexto"].forEach(id => $(id).value = "");
  aplicarFiltros();
}

function inicializarFiltros() {
  poblarFiltroEjercicios();
  ["#filtroEjercicio", "#filtroEtapa", "#filtroEstatus", "#filtroPrioridad"].forEach(id => {
    $(id).addEventListener("change", aplicarFiltros);
  });
  $("#filtroTexto").addEventListener("input", debounce(aplicarFiltros, 300));
  $("#limpiarFiltros").addEventListener("click", limpiarFiltros);
}
