function renderSeccionRiesgos() {
  const altaP = DATOS_FILTRADOS.filter(r => r.prioridad === "ALTA" && r.estatus === "P");
  const noAtendidas = DATOS_FILTRADOS.filter(r => r.estatus === "NA");

  $("#alertasCriticas").innerHTML = `
    <div class="alert-grid">
      <article class="alert-card"><h3>🔴 Recomendaciones ALTA Prioridad Pendientes</h3><span class="num">${altaP.length}</span><div class="badges">${altaP.map(r => badge(r.id2, "bad")).join("") || badge("Sin casos", "neutral")}</div><p>Requieren atención institucional inmediata</p></article>
      <article class="alert-card warn"><h3>🟠 Recomendaciones No Atendidas (NA)</h3><span class="num">${noAtendidas.length}</span><div class="badges">${noAtendidas.map(r => badge(r.id2, "warn")).join("") || badge("Sin casos", "neutral")}</div><p>Sin ninguna acción ejecutada</p></article>
      <article class="alert-card pending"><h3>📋 Documentos Institucionales Sin Formalizar</h3><span class="num">6</span><p>Metodología de evaluación, protocolo de fraude, riesgo, proceso de auditoría, manual de calidad y Comité de Ética.</p><p>Origen: E2-01-25 (Prioridad MEDIA)</p></article>
    </div>
  `;

  const nodos = [
    ["📄", "Calidad de Informes Finales", "3", "E1-04-24 → HC-01-25 / E2-07-24 → E2-01-25 / HC-01-25", "La ausencia de protocolo de revisión escaló de PA a HC", "bad"],
    ["📁", "Formalización Documental", "3", "E2-06-24, E2-07-24, E2-11-24 → E2-01-25", "6 documentos institucionales sin formalizar en 2 ejercicios", "bad"],
    ["⚖️", "Ética e Integridad", "2", "E2-11-24 → E2-01-25 / E4-01-25", "Comité de Ética no instalado. 2 ejercicios consecutivos.", "warn"],
    ["🔍", "Proceso Auditor", "2", "E1-03-24 → HC-02-25 / E2-04-24 → E2-02-25", "Cuellos de botella no diagnosticados derivaron en HC", "warn"]
  ];
  $("#nodosRiesgo").innerHTML = nodos.map(n => `<article class="risk-card ${n[5]}"><h3>${n[0]} ${n[1]} ${badge(n[2] + " vínculos", n[5])}</h3><p class="mono">${n[3]}</p><p>${n[4]}</p></article>`).join("");

  const problemas = [
    ["Protocolo de Fraude", "⚠️ NA", "⚠️ P", "🔴 Sin resolver (2 ejercicios)"],
    ["Manual de Calidad", "⚠️ PA", "⚠️ P", "🔴 Sin resolver (2 ejercicios)"],
    ["Comité de Ética", "⚠️ PA", "⚠️ P", "🔴 Sin resolver (2 ejercicios)"],
    ["Calidad de Informes Finales", "⚠️ PA", "⚠️ HC", "🔴 Escaló a hallazgo crítico"],
    ["Bitácora Tecnológica", "⚠️ PA", "—", "🟡 Solo 2024 (sin info 2025)"],
    ["Declaración Patrimonial", "✓ A", "⚠️ HC", "🟠 Cierre formal incompleto"],
    ["Programa de Capacitación", "✓ A", "⚠️ P", "🟡 Avance sin metas cuantitativas"]
  ];
  $("#tablaProblemas").innerHTML = `<thead><tr><th>Problema</th><th>2024</th><th>2025</th><th>Estado Actual</th></tr></thead><tbody>${problemas.map(f => `<tr><td>${f[0]}</td><td>${f[1]}</td><td>${f[2]}</td><td>${f[3]}</td></tr>`).join("")}</tbody>`;
}

function renderSeccionContinuidad() {
  const vinculos = [
    ["E2-06-24", "NA", "Protocolo de Fraude y Materialidad", "🔴 Reincidencia Directa", "E2-01-25 [Acc.2]", "MEDIA"],
    ["E2-07-24", "PA", "Aseguramiento de Calidad", "🔴 Reincidencia + 🔺 Escalamiento", "E2-01-25[Acc.5] + HC-01-25", "ALTA"],
    ["E2-11-24", "PA", "Comité de Ética", "🔴 Reincidencia Directa", "E2-01-25 [Acc.6]", "MEDIA"],
    ["E1-04-24", "PA", "Revisión y Validación de Informes", "🔺 Escalamiento a HC", "HC-01-25", "ALTA"],
    ["E1-03-24", "NA", "Cuellos de Botella del Proceso Auditor", "🔺 Escalamiento a HC", "HC-02-25", "ALTA"],
    ["E1-02-24", "A", "Declaración Patrimonial y Trazabilidad", "⚠️ Falso Cierre", "HC-03-25", "MEDIA"],
    ["E2-09-24", "A", "Capacitación Institucional", "🟡 Convergencia Temática", "E2-03-25", "MEDIA"],
    ["E2-04-24", "PA", "Planeación y Contenido Mínimo", "🟡 Convergencia Temática", "E2-02-25", "ALTA"]
  ];
  $("#tablaVinculos").innerHTML = `<thead><tr><th>Origen 2024</th><th>Estatus 2024</th><th>Tema</th><th>Tipo de Vínculo</th><th>Recomendación 2025</th><th>Prioridad 2025</th></tr></thead><tbody>${vinculos.map(v => `<tr><td>${badge(v[0], "outline")}</td><td>${badgeEstatus(v[1])}</td><td>${v[2]}</td><td>${v[3]}</td><td>${badge(v[4], "outline")}</td><td>${badgePrioridad(v[5])}</td></tr>`).join("")}</tbody>`;

  $("#flujosEscalamiento").innerHTML = `
    <article class="flow-card"><h3>${badge("E1-04-24", "warn")} PA → OBL8</h3><p>Protocolo de revisión de informes</p><div class="big-number">↓</div><h3>${badge("HC-01-25", "bad")} ALTA</h3><p>Errores documentados en informes finales</p></article>
    <article class="flow-card"><h3>${badge("E1-03-24", "bad")} NA → OBL5/OBL7</h3><p>Cuellos de botella no diagnosticados</p><div class="big-number">↓</div><h3>${badge("HC-02-25", "bad")} ALTA</h3><p>Fallas en supervisión de procedimientos</p></article>
  `;
}

function renderSeccionGobierno() {
  const componentes = [
    ["✗", "Comité de Ética e Integridad", "No instalado", "E2-11-24 + E2-01-25", "MEDIA", "Lineamientos emitidos pero el Comité no se ha constituido en 2 ejercicios consecutivos", "bad"],
    ["✗", "Protocolo ante Indicios de Fraude", "No formalizado", "E2-06-24 + E2-01-25", "MEDIA", "Recomendación ignorada en 2024. Reaparece en 2025 para formalizar", "bad"],
    ["✗", "Manual de Aseguramiento de la Calidad", "Sin autorizar/difundir", "E2-07-24 + HC-01-25", "ALTA", "La falta de formalización derivó en errores documentados en informes finales", "bad"],
    ["✓", "Sistema de Denuncias Ciudadanas", "Instalado", "E2-10-24", "Atendida", "Publicado en la página institucional de la ASEBCS", "good"],
    ["✗", "UEC en Comité de Obras y Adquisiciones", "Pendiente", "E4-01-25", "ALTA", "La UEC debe participar formalmente en sesiones", "bad"],
    ["⚠", "Programa Institucional Anticorrupción", "En proceso", "E2-03-25", "MEDIA", "Existe capacitación, pero sin metas cuantitativas ni evaluación de resultados", "warn"]
  ];
  $("#checkGobierno").innerHTML = componentes.map(c => `<article class="gov-card ${c[6]}"><h3>${c[0]} ${c[1]}</h3><div class="badges">${badge(c[2], c[6])}${badge(c[3], "outline")}${badgePrioridad(c[4])}</div><p>${c[5]}</p></article>`).join("");

  const alta = DATOS_FILTRADOS.filter(r => r.ejercicio_fiscal === 2025 && r.prioridad === "ALTA");
  $("#tablaAltaPrioridad").innerHTML = `<thead><tr><th>ID2</th><th>Etapa</th><th>No. Acciones</th><th>Acciones Pendientes</th><th>Síntesis</th></tr></thead><tbody>${alta.map(r => `<tr><td class="mono">${r.id2}</td><td>${badge(obtenerEtapa(r), "outline")}</td><td>${r.no_acciones}</td><td>${badge(r.acciones_pendientes, "bad")}</td><td>${truncar(r.tipo_recomendacion || r.analisis_recomendacion, 120)}</td></tr>`).join("") || `<tr><td colspan="5">Sin recomendaciones ALTA en la selección actual.</td></tr>`}</tbody>`;
}

function renderContenidoDinamico() {
  renderSeccionRiesgos();
  renderSeccionContinuidad();
  renderSeccionGobierno();
}
