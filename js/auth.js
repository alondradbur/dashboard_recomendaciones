async function calcularHash(texto) {
  const buffer = new TextEncoder().encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function intentarLogin() {
  const input = $("#passwordInput");
  const error = $("#loginError");
  const hash = await calcularHash(input.value);

  if (hash !== HASH_CORRECTO) {
    error.textContent = "Contraseña incorrecta.";
    input.focus();
    return;
  }

  error.textContent = "";
  $("#loginOverlay").classList.add("fade-out");

  setTimeout(() => {
    $("#loginOverlay").classList.add("oculto");
    cargarDatos();
  }, 280);
}

function inicializarLogin() {
  $("#btnLogin").addEventListener("click", intentarLogin);
  $("#passwordInput").addEventListener("keydown", event => {
    if (event.key === "Enter") intentarLogin();
  });
}
