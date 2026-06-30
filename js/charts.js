Chart.defaults.font.family = "Arial, Helvetica, sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.color = "#1f2933";

if (window.ChartDataLabels) {
  Chart.register(window.ChartDataLabels);
}

const imagenMarcaAgua = new Image();
imagenMarcaAgua.src = LOGO_URL;

const pluginMarcaAgua = {
  id: "marcaAguaUEC",
  beforeDraw(chart) {
    if (!imagenMarcaAgua.complete || imagenMarcaAgua.naturalWidth === 0) return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { left, top, width, height } = chartArea;
    const tamanio = Math.min(width, height) * 0.55;
    const x = left + (width - tamanio) / 2;
    const y = top + (height - tamanio) / 2;
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.drawImage(imagenMarcaAgua, x, y, tamanio, tamanio);
    ctx.restore();
  }
};
Chart.register(pluginMarcaAgua);

imagenMarcaAgua.onload = () => {
  Object.values(graficas || {}).forEach(g => g && g.update && g.update());
};

const OPCIONES_COMUNES = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600 },
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 14, padding: 14 } }
  }
};

function conteoPorEstatus(datos) {
  return ["A", "PA", "NA", "P"].map(e => datos.filter(r => r.estatus === e).length);
}

function renderGraficas() {
  renderEstatusDona();
  renderComparativoAnios();
  renderAtencionEtapa();
  renderAccionesProgreso();
  renderTipoEstatus();
  renderEscalamiento();
}

function renderEstatusDona() {
  destruirGrafica("estatusDona");
  const datos = conteoPorEstatus(DATOS_FILTRADOS);
  const total = datos.reduce((a, b) => a + b, 0);
  graficas.estatusDona = new Chart($("#ch-estatus-dona"), {
    type: "doughnut",
    data: { labels: ["A — Atendida", "PA — Parc. Atendida", "NA — No Atendida", "P — Pendiente"], datasets: [{ data: datos, backgroundColor: [COLORES.A, COLORES.PA, COLORES.NA, COLORES.P] }] },
    options: { ...OPCIONES_COMUNES, cutout: "55%", plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { color: "#fff", font: { weight: "bold", size: 13 }, formatter: v => `${total ? Math.round(v / total * 100) : 0}%\n(${v})` } } }
  });
}

function renderComparativoAnios() {
  destruirGrafica("comparativoAnios");
  const datasets = [2024, 2025].filter(anio => DATOS_FILTRADOS.some(r => r.ejercicio_fiscal === anio)).map(anio => ({
    label: String(anio),
    backgroundColor: anio === 2024 ? "#1a4731" : "#2e7d4f",
    data: conteoPorEstatus(DATOS_FILTRADOS.filter(r => r.ejercicio_fiscal === anio))
  }));
  graficas.comparativoAnios = new Chart($("#ch-comparativo-anios"), {
    type: "bar",
    data: {
    labels: [
        "Atendida",
        ["Parcialmente", "Atendida"],
        ["No", "Atendida"],
        "Pendiente"
    ],
    datasets
},
    options: { ...OPCIONES_COMUNES, plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { anchor: "end", align: "top", color: "#1f2933", font: { weight: "bold" } } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
  });
}

function renderAtencionEtapa() {
  destruirGrafica("atencionEtapa");
  const etapas = [...new Set(DATOS_FILTRADOS.map(obtenerEtapa))];
  const valores = etapas.map(etapa => {
    const registros = DATOS_FILTRADOS.filter(r => obtenerEtapa(r) === etapa);
    return registros.length ? (registros.filter(r => r.estatus === "A").length / registros.length) * 100 : 0;
  });
  graficas.atencionEtapa = new Chart($("#ch-atencion-etapa"), {
    type: "bar",
    data: { labels: etapas, datasets: [{ label: "Tasa de atención", data: valores, backgroundColor: valores.map(v => v >= 75 ? COLORES.A : v >= 50 ? COLORES.PA : COLORES.NA) }] },
    options: { ...OPCIONES_COMUNES, indexAxis: "y", plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { anchor: "end", align: "right", formatter: v => `${v.toFixed(1)}%`, font: { weight: "bold" } } }, scales: { x: { min: 0, max: 100, ticks: { callback: v => `${v}%` } } } }
  });
}

function renderAccionesProgreso() {
  destruirGrafica("accionesProgreso");
  const registros = DATOS_FILTRADOS.filter(r => r.no_acciones > 0).sort((a, b) => a.ejercicio_fiscal - b.ejercicio_fiscal).slice(0, 15);
  graficas.accionesProgreso = new Chart($("#ch-acciones-progreso"), {
    type: "bar",
    data: { labels: registros.map(r => r.id2), datasets: [{ label: "Atendidas", data: registros.map(r => r.acciones_atendidas), backgroundColor: COLORES.A }, { label: "Pendientes", data: registros.map(r => r.acciones_pendientes), backgroundColor: "#d8d6cf" }] },
    options: { ...OPCIONES_COMUNES, indexAxis: "y", plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { formatter: v => v >= 1 ? v : "", color: ctx => ctx.dataset.label === "Atendidas" ? "#fff" : "#7a8693", font: { weight: "bold" } } }, scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } } }
  });
}

function renderTipoEstatus() {
  destruirGrafica("tipoEstatus");
  const tipos = [...new Set(DATOS_FILTRADOS.map(r => r.tipo_recomendacion || "Sin tipo"))].slice(0, 8);
  graficas.tipoEstatus = new Chart($("#ch-tipo-estatus"), {
    type: "bar",
    data: { labels: tipos.map(t => truncar(t, 15)), datasets: ["A", "PA", "NA", "P"].map(e => ({ label: e, backgroundColor: COLORES[e], data: tipos.map(t => DATOS_FILTRADOS.filter(r => (r.tipo_recomendacion || "Sin tipo") === t && r.estatus === e).length) })) },
    options: { ...OPCIONES_COMUNES, plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { anchor: "end", align: "top", formatter: v => v || "", font: { weight: "bold" } } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
  });
}

function renderEscalamiento() {
  destruirGrafica("escalamiento");
  graficas.escalamiento = new Chart($("#ch-escalamiento"), {
    type: "doughnut",
    data: { labels: ["Escaladas", "No escaladas"], datasets: [{ data: [2, 2], backgroundColor: [COLORES.NA, COLORES.PA] }] },
    options: { ...OPCIONES_COMUNES, cutout: "55%", plugins: { ...OPCIONES_COMUNES.plugins, datalabels: { color: "#fff", font: { weight: "bold" } } } }
  });
}
