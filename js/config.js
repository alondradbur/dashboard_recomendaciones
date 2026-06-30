const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXHmYKeNCvaR-282atgkNOn6zI8raUwSHEdKF8Fqc5E5bPr_ZA0IlaQBpHKvAR20BB/exec";
const LOGO_URL = "https://i.imgur.com/RAlllZj.jpg";
const HASH_CORRECTO = "56e3e01ec8cec83251ac303f64ff4d203dabbd13b13e6ab4703b544dcc3ff978";

let DATOS_CRUDOS = [];
let DATOS_FILTRADOS = [];
let ULTIMA_ACTUALIZACION = new Date().toISOString();
let graficas = {};
let ordenTabla = { columna: "id2", direccion: "asc" };
let textoDetalle = "";
let filaAbierta = null;

const COLORES = {
  A: "#2e7d4f",
  PA: "#c8923b",
  NA: "#a14a3a",
  P: "#5b7fa6",
  ALTA: "#a14a3a",
  MEDIA: "#c8923b",
  BAJA: "#3f7a4f",
  NA_PRIORIDAD: "#7a8693"
};
