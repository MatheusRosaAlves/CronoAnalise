
let centesimos = 0; // 1 centésimo = 10 ms
let intervalo = null;
let numTomada = 1;
let tempos = [];

function formatarTempo(c) {
  const totalSeg = Math.floor(c / 100);
  const mins = String(Math.floor(totalSeg / 60)).padStart(2, '0');
  const segs = String(totalSeg % 60).padStart(2, '0');
  const cent = String(c % 100).padStart(2, '0');
  return `${mins}:${segs}.${cent}`;
}

function atualizarDisplay() {
  document.getElementById('display').textContent = formatarTempo(centesimos);
}

document.getElementById('start').onclick = function() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    centesimos++;
    atualizarDisplay();
  }, 10);
};

document.getElementById('stop').onclick = function() {
  clearInterval(intervalo);
  intervalo = null;
};

document.getElementById('reset').onclick = function() {
  clearInterval(intervalo);
  intervalo = null;
  centesimos = 0;
  numTomada = 1;
  tempos = [];
  atualizarDisplay();
  document.getElementById('laps').innerHTML = '';
  document.getElementById('media').textContent = '--';
  document.getElementById('menor').textContent = '--';
  document.getElementById('maior').textContent = '--';
};

document.getElementById('lap').onclick = function() {
  if (centesimos === 0) return;

  const lapsContainer = document.getElementById('laps');
  const tempoAtual = formatarTempo(centesimos);

  // Salva tempo
  tempos.push({ numero: numTomada, tempo: centesimos });

  // Mostra registro
  const novaTomada = document.createElement('div');
  novaTomada.classList.add('lap');
  novaTomada.textContent = `Peça ${numTomada++}: ${tempoAtual}`;
  lapsContainer.prepend(novaTomada);

  // Reseta cronômetro
  centesimos = 0;
  atualizarDisplay();

  atualizarEstatisticas();
};

function atualizarEstatisticas() {
  if (tempos.length === 0) return;

  const temposCentesimos = tempos.map(t => t.tempo);
  const soma = temposCentesimos.reduce((a,b) => a + b, 0);
  const media = soma / temposCentesimos.length;
  const menor = Math.min(...temposCentesimos);
  const maior = Math.max(...temposCentesimos);

  const tomadaMenor = tempos.find(t => t.tempo === menor).numero;
  const tomadaMaior = tempos.find(t => t.tempo === maior).numero;

  document.getElementById('media').textContent = formatarTempo(Math.round(media));
  document.getElementById('menor').textContent = `${formatarTempo(menor)} (Peça ${tomadaMenor})`;
  document.getElementById('maior').textContent = `${formatarTempo(maior)} (Peça ${tomadaMaior})`;
}