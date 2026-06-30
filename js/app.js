function inicializarDashboard() {
  inicializarFiltros();
  inicializarTablaDetalle();
  DATOS_FILTRADOS = [...DATOS_CRUDOS];
  actualizarDashboard();
}

function actualizarDashboard() {
  const hayDatos = DATOS_FILTRADOS.length > 0;
  $("#sinDatos").classList.toggle("oculto", hayDatos);
  $("#kpiGrid").classList.toggle("oculto", !hayDatos);

  actualizarKPIs();
  renderSemaforoEjecutivo();
  renderGraficas();
  renderContenidoDinamico();
  renderTablaDetalle();
}

function abrirDrawerFiltros() {
  $("#drawerFiltros").classList.add("abierto");
  $("#overlayFiltros").classList.add("visible");
}

function cerrarDrawerFiltros() {
  $("#drawerFiltros").classList.remove("abierto");
  $("#overlayFiltros").classList.remove("visible");
}

function abrirSidebarMovil() {
  $("#sidebar").classList.add("abierta");
  $("#overlaySidebar").classList.add("visible");
}

function cerrarSidebarMovil() {
  $("#sidebar").classList.remove("abierta");
  $("#overlaySidebar").classList.remove("visible");
}

function cambiarSeccion(idSeccion) {
  $$(".seccion").forEach(sec => sec.classList.remove("activa"));
  $$(".nav-item").forEach(btn => btn.classList.remove("activo"));
  $(`#${idSeccion}`).classList.add("activa");
  $(`.nav-item[data-seccion="${idSeccion}"]`).classList.add("activo");
  cerrarSidebarMovil();
  setTimeout(() => Object.values(graficas).forEach(g => g && g.resize && g.resize()), 80);
}

function inicializarNavegacion() {
  $$(".nav-item").forEach(btn => btn.addEventListener("click", () => cambiarSeccion(btn.dataset.seccion)));
  $("#btnMenuMovil").addEventListener("click", abrirSidebarMovil);
  $("#overlaySidebar").addEventListener("click", cerrarSidebarMovil);
  $("#btnFiltros").addEventListener("click", abrirDrawerFiltros);
  $("#cerrarFiltros").addEventListener("click", cerrarDrawerFiltros);
  $("#overlayFiltros").addEventListener("click", cerrarDrawerFiltros);
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarLogin();
  inicializarNavegacion();
});
