// --- RELOJ EN TIEMPO REAL ---
function actualizarHora() {
  const now = new Date();
  const hora = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("time").textContent = hora;
}
setInterval(actualizarHora, 1000);
actualizarHora();

// --- GRÁFICA DE TEMPERATURAS ---
const ctx = document.getElementById("tempChart");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"],
    datasets: [{
      label: "Temperatura (°C)",
      data: [18, 20, 23, 25, 24, 21],
      borderColor: "#42a5f5",
      backgroundColor: "rgba(66,165,245,0.2)",
      borderWidth: 2,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true, ticks: { color: "#e3f2fd" } },
      x: { ticks: { color: "#e3f2fd" } }
    },
    plugins: { legend: { labels: { color: "#b3e5fc" } } }
  }
});

// --- CALENDARIO FUNCIONAL CON TEMPERATURAS DE DÍAS PASADOS ---
const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date();
const temperaturas = {}; // Guardará las temperaturas por fecha

// Genera temperaturas simuladas "realistas" para los días anteriores
function generarTemperaturasMes(año, mes) {
  const diasMes = new Date(año, mes + 1, 0).getDate();
  for (let d = 1; d <= diasMes; d++) {
    const fechaStr = `${año}-${(mes + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    if (!temperaturas[fechaStr]) {
      // Simulación realista: días más recientes un poco más cálidos
      const base = 20 + Math.sin(d / 3) * 5 + Math.random() * 2;
      temperaturas[fechaStr] = Math.round(base);
    }
  }
}

function generarCalendario(fecha) {
  calendar.innerHTML = "";

  const year = fecha.getFullYear();
  const month = fecha.getMonth();
  generarTemperaturasMes(year, month);

  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  diasSemana.forEach(d => {
    const header = document.createElement("div");
    header.textContent = d;
    header.classList.add("day", "header");
    calendar.appendChild(header);
  });

  // Espacios vacíos antes del primer día del mes
  for (let i = 0; i < primerDia.getDay(); i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // Días del mes
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = i;

    const fechaStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
    const temp = temperaturas[fechaStr];

    // Mostrar temperatura debajo del número
    const tempSpan = document.createElement("div");
    tempSpan.classList.add("temp");
    tempSpan.textContent = `${temp}°C`;
    day.appendChild(tempSpan);

    // Día actual
    const hoy = new Date();
    if (
      i === hoy.getDate() &&
      month === hoy.getMonth() &&
      year === hoy.getFullYear()
    ) {
      day.classList.add("today");
    }

    calendar.appendChild(day);
  }

  const nombreMes = fecha.toLocaleString("es-ES", { month: "long" });
  monthYear.textContent = `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${year}`;
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generarCalendario(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generarCalendario(currentDate);
});

generarCalendario(currentDate);

// --- CONVERSOR ---
function convertir() {
  const tipo = document.getElementById("tipo").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const resultado = document.getElementById("resultado");

  if (isNaN(valor)) {
    resultado.textContent = "Por favor ingresa un número válido.";
    return;
  }

  let res;
  switch (tipo) {
    case "CtoF":
      res = (valor * 9) / 5 + 32;
      break;
    case "FtoC":
      res = ((valor - 32) * 5) / 9;
      break;
    case "CtoK":
      res = valor + 273.15;
      break;
    case "KtoC":
      res = valor - 273.15;
      break;
  }

  resultado.textContent = `Resultado: ${res.toFixed(2)}°`;
}
