function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function obtenerEtapa(registro) {
  if (registro.etapa) return String(registro.etapa).trim();
  return String(registro.id2 || "").split("-")[0] || "N/A";
}

function numero(valor) {
  const convertido = Number(valor);
  return Number.isFinite(convertido) ? convertido : 0;
}

function porcentaje(parte, total, decimales = 0) {
  if (!total) return `0${decimales ? ".0" : ""}%`;
  return `${((parte / total) * 100).toFixed(decimales)}%`;
}

function formatoFecha(iso) {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(iso));
  } catch {
    return "--";
  }
}

function textoRegistro(registro) {
  return Object.values(registro).join(" ").toLowerCase();
}

function truncar(texto, limite) {
  const limpio = String(texto || "");
  return limpio.length > limite ? `${limpio.slice(0, limite)}...` : limpio;
}

function badge(texto, tipo = "neutral") {
  return `<span class="badge ${tipo}">${texto}</span>`;
}

function badgeEstatus(estatus) {
  const mapa = { A: "good", PA: "warn", NA: "bad", P: "pending" };
  return badge(estatus || "N/A", mapa[estatus] || "neutral");
}

function badgePrioridad(prioridad) {
  const limpia = String(prioridad || "N/A").toUpperCase();
  const mapa = { ALTA: "bad", MEDIA: "warn", BAJA: "good", "N/A": "neutral" };
  return badge(limpia, mapa[limpia] || "neutral");
}

function debounce(fn, espera = 300) {
  let temporizador;
  return function (...args) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn.apply(this, args), espera);
  };
}

function destruirGrafica(clave) {
  if (graficas[clave]) {
    graficas[clave].destroy();
    delete graficas[clave];
  }
}
