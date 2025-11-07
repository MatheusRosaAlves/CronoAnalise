let centesimos = 0; // 1 centésimo = 10 ms
let intervalo = null;
let numTomada = 1;
let tempos = [];

function formatarTempo(c) {
  const totalSeg = Math.floor(c / 100);
  const mins = String(Math.floor(totalSeg / 60)).padStart(2, "0");
  const segs = String(totalSeg % 60).padStart(2, "0");
  const cent = String(c % 100).padStart(2, "0");
  return `${mins}:${segs}.${cent}`;
}

function atualizarDisplay() {
  document.getElementById("display").textContent = formatarTempo(centesimos);
}

document.getElementById("start").onclick = function () {
  if (intervalo) return;
  intervalo = setInterval(() => {
    centesimos++;
    atualizarDisplay();
  }, 10);
};

document.getElementById("stop").onclick = function () {
  clearInterval(intervalo);
  intervalo = null;
};

document.getElementById("reset").onclick = function () {
  clearInterval(intervalo);
  intervalo = null;
  centesimos = 0;
  numTomada = 1;
  tempos = [];
  atualizarDisplay();
  document.getElementById("laps").innerHTML = "";
  document.getElementById("media").textContent = "--";
  document.getElementById("menor").textContent = "--";
  document.getElementById("maior").textContent = "--";
  document.getElementById("Total").textContent = "0";
  grafico.data.labels = [];
  grafico.data.datasets[0].data = [];
  grafico.update();
};

document.getElementById("lap").onclick = function () {
  if (centesimos === 0) return;

  const lapsContainer = document.getElementById("laps");
  const tempoAtual = formatarTempo(centesimos);

  // Guarda o tempo bruto e o número da peça
  tempos.push({ numero: numTomada, tempo: centesimos });

  // Mostra na lista
  const novaTomada = document.createElement("div");
  novaTomada.classList.add("lap");
  novaTomada.textContent = `Peça ${numTomada++}: ${tempoAtual}`;
  lapsContainer.prepend(novaTomada);

  // Atualiza o gráfico
  registrarTempo(centesimos / 100); // converte pra segundos

  // Reseta cronômetro
  centesimos = 0;
  atualizarDisplay();

  atualizarEstatisticas();
};

function atualizarEstatisticas() {
  if (tempos.length === 0) return;

  const soma = tempos.reduce((a, b) => a + b.tempo, 0);
  const media = soma / tempos.length;
  const min = Math.min(...tempos.map((t) => t.tempo));
  const max = Math.max(...tempos.map((t) => t.tempo));

  const tomadaMenor = tempos.find((t) => t.tempo === min).numero;
  const tomadaMaior = tempos.find((t) => t.tempo === max).numero;

  document.getElementById("media").textContent = formatarTempo(
    Math.round(media)
  );
  document.getElementById("menor").textContent = `${formatarTempo(
    min
  )} (Peça ${tomadaMenor})`;
  document.getElementById("maior").textContent = `${formatarTempo(
    max
  )} (Peça ${tomadaMaior})`;

  document.getElementById("Total").textContent = numTomada - 1;
}

// ============================
//       GRÁFICO
// ============================
const ctx = document.getElementById("graficoTempos").getContext("2d");
const grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Tempo por Peça (s)",
        data: [],
        borderColor: "rgb(0, 255, 255)",
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function registrarTempo(novoTempo) {
  grafico.data.labels.push(`Peça ${tempos.length}`);
  grafico.data.datasets[0].data.push(novoTempo);
  grafico.update();
}

document.getElementById("exportarCSV").onclick = function () {
  if (tempos.length === 0) {
    alert("Nenhum dado para exportar!");
    return;
  }

  // Cabeçalho do CSV
  let csv = "Tomada,Tempo (s)\n";

  // Adiciona os dados linha a linha
  tempos.forEach((t) => {
    const tempoSeg = (t.tempo / 100).toFixed(2);
    csv += `${t.numero},${tempoSeg}\n`;
  });

  const soma = tempos.reduce((a, b) => a + b.tempo, 0);
  const media = soma / tempos.length;
  const min = Math.min(...tempos.map((t) => t.tempo));
  const max = Math.max(...tempos.map((t) => t.tempo));

  csv += `\nMédia,${(media / 100).toFixed(2)}\n`;
  csv += `Menor,${(min / 100).toFixed(2)}\n`;
  csv += `Maior,${(max / 100).toFixed(2)}\n`;

  // Cria um Blob com o conteúdo CSV
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Cria um link temporário pra download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tempos.csv";
  link.click();
};

document.getElementById("exportarExcel").onclick = function () {
  if (tempos.length === 0) {
    alert("Nenhum dado para exportar!");
    return;
  }

  // Monta os dados da planilha
  const dados = [["Tomada", "Tempo (s)"]];

  tempos.forEach(t => {
    dados.push([t.numero, Number((t.tempo / 100).toFixed(2))]);
  });

  // Adiciona estatísticas
  const soma = tempos.reduce((a, b) => a + b.tempo, 0);
  const media = soma / tempos.length;
  const min = Math.min(...tempos.map(t => t.tempo));
  const max = Math.max(...tempos.map(t => t.tempo));

  dados.push([]);
  dados.push(["Média", (media / 100).toFixed(2)]);
  dados.push(["Menor", (min / 100).toFixed(2)]);
  dados.push(["Maior", (max / 100).toFixed(2)]);

  // Cria a planilha
  const ws = XLSX.utils.aoa_to_sheet(dados);

  // Cria o workbook e adiciona a aba
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tempos");

  // Gera o arquivo Excel
  XLSX.writeFile(wb, "tempos.xlsx");
};

