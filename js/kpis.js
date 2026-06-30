function calcularKPIs(datos) {
  const total = datos.length;
  const contar = estatus => datos.filter(r => r.estatus === estatus).length;

  return {
    total,
    anio2024: datos.filter(r => r.ejercicio_fiscal === 2024).length,
    anio2025: datos.filter(r => r.ejercicio_fiscal === 2025).length,
    A: contar("A"),
    PA: contar("PA"),
    NA: contar("NA"),
    P: contar("P"),
    accionesPendientes: datos.reduce((suma, r) => suma + numero(r.acciones_pendientes), 0)
  };
}

function actualizarKPIs() {
  const k = calcularKPIs(DATOS_FILTRADOS);
  const ejercicios = [...new Set(DATOS_FILTRADOS.map(r => r.ejercicio_fiscal).filter(Boolean))];

  $("#statTotal").textContent = k.total;
  $("#statEjercicios").textContent = ejercicios.length;

 const statActualizado = $("#statActualizado");

if (statActualizado) {
  statActualizado.textContent = formatoFecha(ULTIMA_ACTUALIZACION);
}


  $("#footerMeta").textContent = `Sistema de Seguimiento de Recomendaciones · Hoja: SEGUIMIENTO · Datos cargados desde Google Sheets · Última actualización: ${formatoFecha(ULTIMA_ACTUALIZACION)}`;

  $("#kpiTotal").textContent = k.total;
  $("#kpiTotalSub").textContent = `${k.anio2024} en 2024 · ${k.anio2025} en 2025`;
  $("#kpiA").textContent = `${k.A} · ${porcentaje(k.A, k.total)}`;
  $("#kpiPA").textContent = `${k.PA} · ${porcentaje(k.PA, k.total)}`;
  $("#kpiNA").textContent = `${k.NA} · ${porcentaje(k.NA, k.total)}`;
  $("#kpiP").textContent = `${k.P} · ${porcentaje(k.P, k.total)}`;
  $("#kpiAccPend").textContent = k.accionesPendientes;
}

function renderSemaforoEjecutivo() {
  const k = calcularKPIs(DATOS_FILTRADOS);
  const tasa = k.total ? Math.round((k.A / k.total) * 100) : 0;
  const claseTasa = tasa >= 70 ? "good" : tasa >= 50 ? "warn" : "bad";
  const altasPendientes = DATOS_FILTRADOS.filter(r => r.ejercicio_fiscal === 2025 && r.prioridad === "ALTA" && r.estatus === "P").length;

  $("#semaforoEjecutivo").innerHTML = `
    <article class="sem-card ${claseTasa}"><h3>Tasa de Atención Global</h3><strong>${tasa}%</strong><p>${k.A} atendidas de ${k.total} totales</p></article>
    <article class="sem-card ${altasPendientes ? "bad" : "good"}"><h3>Alta Prioridad Pendientes (2025)</h3><strong>${altasPendientes}</strong><p>Requieren atención inmediata</p></article>
    <article class="sem-card warn"><h3>Recomendaciones Reincidentes</h3><strong>8 vínculos detectados</strong><p>Entre ejercicios 2024→2025</p></article>
    <article class="sem-card bad"><h3>Comité de Ética</h3><strong>No instalado</strong><p>2 ejercicios consecutivos pendiente</p></article>
  `;
}
