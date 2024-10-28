async function getMonedas() {
  try {
    const endpoint = "https://mindicador.cl/api/";
    const res = await fetch(endpoint);
    const data = await res.json();
    return data;
  } catch (e) {
    const error = document.querySelector("#error");
    error.innerHTML = "¡Algo salió mal!";
  }
}

async function llenarSelectConMonedas() {
  const selectMoneda = document.querySelector("#moneda");
  const monedas = await getMonedas();

  selectMoneda.innerHTML = "";

  for (let moneda in monedas) {
    if (monedas[moneda].codigo && monedas[moneda].nombre) {
      const option = document.createElement("option");
      option.value = moneda;
      option.text = monedas[moneda].nombre;
      selectMoneda.appendChild(option);
    }
  }
}

async function convertirMoneda() {
  const valorCLP = Number(document.querySelector("#monedasInput").value);
  const selectMoneda = document.querySelector("#moneda");
  const valorMonedaSeleccionada = selectMoneda.value;
  const resultadoDiv = document.querySelector("#resultado");

  if (valorCLP && valorMonedaSeleccionada) {
    const monedas = await getMonedas();
    const valorMoneda = monedas[valorMonedaSeleccionada].valor;

    const resultado = valorCLP / valorMoneda;
    resultadoDiv.innerHTML = `Resultado: $${resultado.toFixed(
      2
    )} en la moneda seleccionada.`;
    const graficoDiv= document.querySelector(".contenedorGrafico")
    graficoDiv.style.display="flex"

    actualizarGrafico(valorMonedaSeleccionada);
  } else {
    resultadoDiv.innerHTML =
      "Por favor ingresa un valor en CLP y selecciona una moneda.";
  }
}
llenarSelectConMonedas();

async function getHistoricoMoneda(moneda) {
  try {
    const endpoint = `https://mindicador.cl/api/${moneda}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return data.serie.slice(0, 10);
  } catch (e) {
    const error = document.querySelector("#error");
    error.innerHTML = "¡Algo salió mal!";
  }
}

async function actualizarGrafico(moneda) {
  const historico = await getHistoricoMoneda(moneda);

  const labels = historico.map((dia) => dia.fecha);
  const valores = historico.map((dia) => dia.valor);

  if (window.miGrafico) {
    window.miGrafico.destroy();
  }

  const ctx = document.getElementById("grafico").getContext("2d");
  window.miGrafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Valor del ${moneda.toUpperCase()}`,
          data: valores,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          ticks: {
            beginAtZero: false,
          },
        },
      },
    },
  });
}
