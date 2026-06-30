function datosTablaDetalle() {
  const texto = textoDetalle.trim().toLowerCase();
  const datos = texto ? DATOS_FILTRADOS.filter(r => textoRegistro(r).includes(texto)) : [...DATOS_FILTRADOS];

  datos.sort((a, b) => {
    const valorA = a[ordenTabla.columna];
    const valorB = b[ordenTabla.columna];
    const comparacion = String(valorA).localeCompare(String(valorB), "es", { numeric: true });
    return ordenTabla.direccion === "asc" ? comparacion : -comparacion;
  });

  return datos;
}

function renderTablaDetalle() {
  const datos = datosTablaDetalle();
  const columnas = [
    ["ejercicio_fiscal", "Ejercicio"],
    ["id2", "ID2"],
    ["etapa", "Etapa"],
    ["tipo_recomendacion", "Tipo / Resultado"],
    ["no_acciones", "Acciones"],
    ["estatus", "Estatus"],
    ["acciones_atendidas", "Progreso"],
    ["prioridad", "Prioridad"],
    ["expandir", "▶"]
  ];

  $("#contadorDetalle").textContent = `Mostrando ${datos.length} de ${DATOS_FILTRADOS.length} recomendaciones`;
  $("#tablaDetalle").innerHTML = `
    <thead>
      <tr>${columnas.map(c => `<th data-col="${c[0]}">${c[1]} ${ordenTabla.columna === c[0] ? (ordenTabla.direccion === "asc" ? "▲" : "▼") : ""}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${datos.map((r, i) => filaTabla(r, i)).join("")}
    </tbody>
  `;

  $$("#tablaDetalle th[data-col]").forEach(th => th.addEventListener("click", () => ordenarTabla(th.dataset.col)));
  $$("#tablaDetalle tbody tr.fila-base").forEach(tr => tr.addEventListener("click", () => toggleDetalle(Number(tr.dataset.index))));
}

function filaTabla(r, i) {
  const progresoClase = r.acciones_atendidas === r.no_acciones ? "good" : r.acciones_atendidas > 0 ? "warn" : "bad";
  return `
    <tr class="fila-base" data-index="${i}">
      <td>${badge(r.ejercicio_fiscal, r.ejercicio_fiscal === 2024 ? "neutral" : "good")}</td>
      <td class="mono">${r.id2}</td>
      <td>${badge(obtenerEtapa(r), "outline")}</td>
      <td title="${r.tipo_recomendacion}">${truncar(r.tipo_recomendacion || r.numero_resultado, 25)}</td>
      <td style="text-align:center">${r.no_acciones}</td>
      <td>${badgeEstatus(r.estatus)}</td>
      <td>${badge(`${r.acciones_atendidas}/${r.no_acciones}`, progresoClase)}</td>
      <td>${badgePrioridad(r.prioridad)}</td>
      <td><button class="btn-expandir">▶</button></td>
    </tr>
  `;
}

function ordenarTabla(columna) {
  if (columna === "expandir") return;
  if (ordenTabla.columna === columna) {
    ordenTabla.direccion = ordenTabla.direccion === "asc" ? "desc" : "asc";
  } else {
    ordenTabla.columna = columna;
    ordenTabla.direccion = "asc";
  }
  filaAbierta = null;
  renderTablaDetalle();
}

function toggleDetalle(index) {
  const tabla = $("#tablaDetalle tbody");
  const existente = tabla.querySelector(".fila-detalle");
  if (existente) existente.remove();

  if (filaAbierta === index) {
    filaAbierta = null;
    return;
  }

  filaAbierta = index;
  const datos = datosTablaDetalle();
  const r = datos[index];
  const fila = tabla.querySelector(`tr[data-index="${index}"]`);
  fila.insertAdjacentHTML("afterend", `
    <tr class="fila-detalle">
      <td colspan="9">
        <div class="detalle-panel">
          <div class="detalle-grid">
            ${detalleBox("Ejercicio Fiscal", r.ejercicio_fiscal)}
            ${detalleBox("ID2", r.id2)}
            ${detalleBox("Etapa", obtenerEtapa(r))}
            ${detalleBox("Número de Resultado", r.numero_resultado)}
            ${detalleBox("Tipo de Recomendación", r.tipo_recomendacion)}
            ${detalleBox("No. Acciones", r.no_acciones)}
            ${detalleBox("Acciones Atendidas", r.acciones_atendidas)}
            ${detalleBox("Acciones Pendientes", r.acciones_pendientes)}
            ${detalleBox("Estatus", badgeEstatus(r.estatus))}
            ${detalleBox("Prioridad", badgePrioridad(r.prioridad))}
          </div>
          <strong>Acciones Específicas:</strong>
          <div class="detalle-texto">${r.acciones_detalle || "Sin detalle"}</div>
          <strong>Análisis / Recomendación:</strong>
          <div class="detalle-texto">${r.analisis_recomendacion || "Sin análisis"}</div>
        </div>
      </td>
    </tr>
  `);
}

function detalleBox(label, valor) {
  return `<div class="detalle-box"><small>${label}</small><br><strong>${valor}</strong></div>`;
}

function inicializarTablaDetalle() {
  $("#buscadorDetalle").addEventListener("input", debounce(event => {
    textoDetalle = event.target.value;
    filaAbierta = null;
    renderTablaDetalle();
  }, 300));
}
