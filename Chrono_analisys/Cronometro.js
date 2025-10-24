
let centesimos = 0; // 1 centésimo = 10 ms
    let intervalo = null;
    let numTomada = 1;

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
      }, 10); // atualiza a cada 10ms (1 centésimo)
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
      atualizarDisplay();
      document.getElementById('laps').innerHTML = '';
    };

    document.getElementById('lap').onclick = function() {
      if (centesimos === 0) return;
      const lapsContainer = document.getElementById('laps');
      const tempoAtual = formatarTempo(centesimos);
      const novaTomada = document.createElement('div');
      novaTomada.classList.add('lap');
      novaTomada.textContent = `Tomada ${numTomada++}: ${tempoAtual}`;
      lapsContainer.prepend(novaTomada);
      centesimos=0;
    };
