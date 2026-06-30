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
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 14,
        padding: 14
      }
    }
  }
};

/* ========================= */
/* CONTEO POR ESTATUS        */
/* ========================= */

function conteoPorEstatus(datos) {
  return ["A", "PA", "NA", "P"].map(e =>
    datos.filter(r => r.estatus === e).length
  );
}

/* ========================= */
/* RENDER GENERAL            */
/* ========================= */

function renderGraficas() {
  renderEstatusDona();
  renderComparativoAnios();
  renderAtencionEtapa();
  renderAccionesProgreso();
  renderTipoEstatus();
  renderEscalamiento();
}

/* ========================= */
/* DISTRIBUCIÓN GLOBAL       */
/* ========================= */

function renderEstatusDona() {
  destruirGrafica("estatusDona");

  const datos = conteoPorEstatus(DATOS_FILTRADOS);
  const total = datos.reduce((a, b) => a + b, 0);

  graficas.estatusDona = new Chart($("#ch-estatus-dona"), {
    type: "doughnut",
    data: {
      labels: [
        "A — Atendida",
        "PA — Parc. Atendida",
        "NA — No Atendida",
        "P — Pendiente"
      ],
      datasets: [
        {
          data: datos,
          backgroundColor: [
            COLORES.A,
            COLORES.PA,
            COLORES.NA,
            COLORES.P
          ]
        }
      ]
    },
    options: {
      ...OPCIONES_COMUNES,
      cutout: "55%",
      plugins: {
        ...OPCIONES_COMUNES.plugins,
        datalabels: {
          color: "#fff",
          font: {
            weight: "bold",
            size: 13
          },
          formatter: v => `${total ? Math.round((v / total) * 100) : 0}%\n(${v})`
        }
      }
    }
  });
}

/* ========================= */
/* COMPARATIVO 2024 VS 2025  */
/* ========================= */

function renderComparativoAnios() {
  destruirGrafica("comparativoAnios");

  const datasets = [2024, 2025]
    .filter(anio =>
      DATOS_FILTRADOS.some(r => r.ejercicio_fiscal === anio)
    )
    .map(anio => ({
      label: String(anio),
      backgroundColor: anio === 2024 ? "#AFCBFF" : "#0B3D91",
      data: conteoPorEstatus(
        DATOS_FILTRADOS.filter(r => r.ejercicio_fiscal === anio)
      )
    }));

  graficas.comparativoAnios = new Chart($("#ch-comparativo-anios"), {
    type: "bar",
    data: {
      labels: [
        "Atendida",
        ["Parcialmente", "Atendida"],
        ["No", "Atendida"],
        ["Pendiente de", "Atender"]
      ],
      datasets
    },
    options: {
      ...OPCIONES_COMUNES,
      plugins: {
        ...OPCIONES_COMUNES.plugins,
        datalabels: {
          anchor: "end",
          align: "top",
          color: "#1f2933",
          font: {
            weight: "bold"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

/* ========================= */
/* ATENCIÓN POR ETAPA        */
/* ========================= */

function renderAtencionEtapa() {
  destruirGrafica("atencionEtapa");

  const etapas = [...new Set(DATOS_FILTRADOS.map(obtenerEtapa))];

  const valores = etapas.map(etapa => {
    const registros = DATOS_FILTRADOS.filter(r => obtenerEtapa(r) === etapa);
    return registros.length
      ? (registros.filter(r => r.estatus === "A").length / registros.length) * 100
      : 0;
  });

  graficas.atencionEtapa = new Chart($("#ch-atencion-etapa"), {
    type: "bar",
    data: {
      labels: etapas,
      datasets: [
        {
          label: "Tasa de atención",
          data: valores,
          backgroundColor: valores.map(v =>
            v >= 75 ? COLORES.A : v >= 50 ? COLORES.PA : COLORES.NA
          )
        }
      ]
    },
    options: {
      ...OPCIONES_COMUNES,
      indexAxis: "y",
      plugins: {
        ...OPCIONES_COMUNES.plugins,
        datalabels: {
          anchor: "end",
          align: "right",
          formatter: v => `${v.toFixed(1)}%`,
          font: {
            weight: "bold"
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            callback: v => `${v}%`
          }
        }
      }
    }
  });
}

/* ========================= */
/* ACCIONES EN PROGRESO      */
/* ========================= */

function renderAccionesProgreso() {
  destruirGrafica("accionesProgreso");

  const registros = DATOS_FILTRADOS
    .filter(r => r.no_acciones > 0)
    .sort((a, b) => a.ejercicio_fiscal - b.ejercicio_fiscal)
    .slice(0, 15);

  graficas.accionesProgreso = new Chart($("#ch-acciones-progreso"), {
    type: "bar",
    data: {
      labels: registros.map(r => r.id2),
      datasets: [
        {
          label: "Atendidas",
          data: registros.map(r => r.acciones_atendidas),
          backgroundColor: COLORES.A
        },
        {
          label: "Pendientes",
          data: registros.map(r => r.acciones_pendientes),
          backgroundColor: "#d8d6cf"
        }
      ]
    },
    options: {
      ...OPCIONES_COMUNES,
      indexAxis: "y",
      plugins: {
        ...OPCIONES_COMUNES.plugins,
        datalabels: {
          formatter: v => (v >= 1 ? v : ""),
          color: ctx => ctx.dataset.label === "Atendidas" ? "#fff" : "#7a8693",
          font: {
            weight: "bold"
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true
        },
        y: {
          stacked: true
        }
      }
    }
  });
}

/* ========================= */
/* TIPO POR ESTATUS          */
/* ========================= */

function renderTipoEstatus() {
  destruirGrafica("tipoEstatus");
  destruirGrafica("tipoEstatus2024");
  destruirGrafica("tipoEstatus2025");

  const canvasOriginal = $("#ch-tipo-estatus");
  if (!canvasOriginal) return;

  const contenedor = canvasOriginal.parentElement;

  contenedor.style.minHeight = "470px";

  contenedor.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:28px; align-items:center; height:340px;">
      <div style="position:relative; height:300px;">
        <div style="text-align:center; font-weight:700; color:#00402f; font-size:22px; margin-bottom:8px;">2024</div>
        <canvas id="ch-tipo-estatus-2024"></canvas>
      </div>

      <div style="position:relative; height:300px;">
        <div style="text-align:center; font-weight:700; color:#00402f; font-size:22px; margin-bottom:8px;">2025</div>
        <canvas id="ch-tipo-estatus-2025"></canvas>
      </div>
    </div>

    <div id="leyendaTipoRecomendacion" style="
      margin-top:42px;
      padding:14px 18px;
      border:1px solid #ddd8cc;
      border-radius:12px;
      background:#fff;
      display:flex;
      flex-wrap:wrap;
      gap:12px 22px;
      font-size:12px;
      color:#1f2933;
    "></div>
  `;

  const estatus = ["A", "PA", "NA", "P"];

  const etiquetasEstatus = {
    A: "A — Atendida",
    PA: "PA — Parc. Atendida",
    NA: "NA — No Atendida",
    P: "P — Pendiente"
  };

  const coloresEstatus = [
    COLORES.A,
    COLORES.PA,
    COLORES.NA,
    COLORES.P
  ];

  function datosPorAnio(anio) {
    const registros = DATOS_FILTRADOS.filter(r => r.ejercicio_fiscal === anio);

    return estatus.map(e =>
      registros.filter(r => r.estatus === e).length
    );
  }

  function crearGrafica(anio, canvasId, keyGrafica) {
    const datos = datosPorAnio(anio);

    graficas[keyGrafica] = new Chart($(canvasId), {
      type: "doughnut",
      data: {
        labels: estatus.map(e => etiquetasEstatus[e]),
        datasets: [
          {
            data: datos,
            backgroundColor: coloresEstatus,
            borderColor: "#ffffff",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "42%",
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return `Total: ${context.raw}`;
              }
            }
          },
          datalabels: {
            color: "#ffffff",
            font: {
              weight: "bold",
              size: 14
            },
            formatter: function(value, context) {
              if (!value) return "";

              const etiqueta = estatus[context.dataIndex];

              return `${etiqueta}\n${value}`;
            }
          }
        }
      }
    });
  }

  crearGrafica(2024, "#ch-tipo-estatus-2024", "tipoEstatus2024");
  crearGrafica(2025, "#ch-tipo-estatus-2025", "tipoEstatus2025");

  const tipos = [
    ...new Set(DATOS_FILTRADOS.map(r => r.tipo_recomendacion || "Sin tipo"))
  ].slice(0, 12);

  const coloresLeyenda = [
  "#1B7F4A",
  "#C79A3B",
  "#B44A3A",
  "#496C9E",
  "#7A4FA3",
  "#25A8B5",
  "#E1782D",
  "#8A8A8A",
  "#4E8D63",
  "#A95D5D",
  "#2E6BA6",
  "#5B7F36"
];

$("#leyendaTipoRecomendacion").innerHTML =
  tipos.map((t, i) => `
    <span style="
      display:flex;
      align-items:center;
      gap:8px;
      min-width:280px;
    ">
      <span style="
        width:12px;
        height:12px;
        border-radius:50%;
        background:${coloresLeyenda[i % coloresLeyenda.length]};
        display:inline-block;
      "></span>

      <span>${t}</span>
    </span>
`).join("");
}
/* ========================= */
/* ESCALAMIENTO              */
/* ========================= */

function renderEscalamiento() {
  destruirGrafica("escalamiento");

  graficas.escalamiento = new Chart($("#ch-escalamiento"), {
    type: "doughnut",
    data: {
      labels: ["Escaladas", "No escaladas"],
      datasets: [
        {
          data: [2, 2],
          backgroundColor: [COLORES.NA, COLORES.PA]
        }
      ]
    },
    options: {
      ...OPCIONES_COMUNES,
      cutout: "55%",
      plugins: {
        ...OPCIONES_COMUNES.plugins,
        datalabels: {
          color: "#fff",
          font: {
            weight: "bold"
          }
        }
      }
    }
  });
}
