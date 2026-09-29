// =======================
// Função para buscar estatísticas via XHR
// =======================
function fetchInicio() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8080/api/estatisticas/resumo', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          renderEstatisticas(data);
        } catch (e) {
          console.error('Erro ao parsear JSON:', e);
          document.getElementById('main-content').innerHTML =
            '<p>Erro ao processar dados de estatísticas.</p>';
        }
      } else {
        console.error('Erro ao buscar estatísticas:', xhr.status, xhr.statusText);
        document.getElementById('main-content').innerHTML =
          '<p>Erro ao carregar estatísticas.</p>';
      }
    }
  };
  xhr.send();
}

// =======================
// Função para criar card estilo Pinterest
// =======================
function criarCard(titulo, valor, cor = '#4caf50') {
  const card = document.createElement('div');
  card.className = "dashboard-card";
  card.style.background = '#fff';
  card.style.padding = '25px';
  card.style.width = '160px';
  card.style.height = '200px';
  card.style.borderRadius = '18px';
  card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.justifyContent = 'center';
  card.style.alignItems = 'center';
  card.style.transition = 'transform 0.3s, box-shadow 0.3s';
  card.onmouseover = () => {
    card.style.transform = 'translateY(-8px) scale(1.05)';
    card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
  };
  card.onmouseleave = () => {
    card.style.transform = 'translateY(0) scale(1)';
    card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
  };

  const h3 = document.createElement('h3');
  h3.textContent = titulo;
  h3.style.marginBottom = '12px';
  h3.style.fontSize = '18px';
  h3.style.fontWeight = '500';
  h3.style.color = '#555';
  h3.style.textAlign = 'center';

  const p = document.createElement('p');
  p.textContent = valor;
  p.style.fontSize = '26px';
  p.style.fontWeight = 'bold';
  p.style.color = cor;
  p.style.textAlign = 'center';

  card.appendChild(h3);
  card.appendChild(p);
  return card;
}

// =======================
// Função para criar caixa de gráfico
// =======================
function criarCaixaGrafico(titulo) {
  const caixa = document.createElement('div');
  caixa.className = "dashboard-box";
  caixa.style.background = '#fff';
  caixa.style.padding = '18px';
  caixa.style.borderRadius = '15px';
  caixa.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
  caixa.style.display = 'flex';
  caixa.style.flexDirection = 'column';
  caixa.style.alignItems = 'center';

  const h2 = document.createElement('h2');
  h2.textContent = titulo;
  h2.style.marginBottom = '12px';
  h2.style.fontSize = '16px';
  h2.style.color = '#333';
  h2.style.textAlign = 'center';
  caixa.appendChild(h2);

  return caixa;
}

// =======================
// Função para renderizar dashboard
// =======================
function renderEstatisticas(data) {
  const container = document.getElementById('main-content');
  container.innerHTML = '';

  const dashboard = document.createElement('div');
  dashboard.id = "dashboard-wrapper";
  dashboard.style.display = 'flex';
  dashboard.style.gap = '25px';
  dashboard.style.fontFamily = 'Arial, sans-serif';

  // Coluna central
  const centralContainer = document.createElement('div');
  centralContainer.style.flex = '3';
  centralContainer.style.display = 'flex';
  centralContainer.style.flexDirection = 'column';
  centralContainer.style.gap = '25px';

  // Cards
  const cardsContainer = document.createElement('div');
  cardsContainer.style.display = 'flex';
  cardsContainer.style.gap = '35px';
  cardsContainer.style.flexWrap = 'nowrap';
  cardsContainer.style.overflowX = 'auto';
  cardsContainer.style.paddingBottom = '10px';

  cardsContainer.appendChild(criarCard('Usuários', data.totalUsuarios, '#4caf50'));
  cardsContainer.appendChild(criarCard('Denúncias', data.totalDenuncias, '#f44336'));
  cardsContainer.appendChild(criarCard('Seres', data.totalSeres, '#ff9800'));
  cardsContainer.appendChild(criarCard('Espécies', data.totalEspecies, '#2196f3'));

  centralContainer.appendChild(cardsContainer);

  // Gráfico grande inferior
  const caixaGraficoInferior = criarCaixaGrafico('Visão Geral');
  caixaGraficoInferior.style.width = '100%';
  caixaGraficoInferior.style.height = '300px';
  const canvasInferior = document.createElement('canvas');
  canvasInferior.width = 900;
  canvasInferior.height = 300;
  caixaGraficoInferior.appendChild(canvasInferior);
  centralContainer.appendChild(caixaGraficoInferior);

  if (data.evolucaoMensal) {
    new Chart(canvasInferior.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.evolucaoMensal.meses,
        datasets: [
          {
            label: 'Denúncias',
            data: data.evolucaoMensal.denuncias,
            borderColor: '#f44336',
            backgroundColor: 'rgba(244,67,54,0.2)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Seres',
            data: data.evolucaoMensal.seres,
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255,152,0,0.2)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
      }
    });
  }

  dashboard.appendChild(centralContainer);

  // Aside direito
  const asideContainer = document.createElement('div');
  asideContainer.style.flex = '1';
  asideContainer.style.display = 'flex';
  asideContainer.style.flexDirection = 'column';
  asideContainer.style.gap = '25px';

  // Gráfico de denúncias por status
  const caixaDenuncias = criarCaixaGrafico('Denúncias por Status');
  const canvasDenuncias = document.createElement('canvas');
  canvasDenuncias.width = 220;
  canvasDenuncias.height = 220;
  caixaDenuncias.appendChild(canvasDenuncias);
  asideContainer.appendChild(caixaDenuncias);

  new Chart(canvasDenuncias.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(data.denunciasPorStatus),
      datasets: [{
        data: Object.values(data.denunciasPorStatus),
        backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3']
      }]
    },
    options: { responsive: false, plugins: { legend: { position: 'bottom' } } }
  });

  // Gráfico de espécies por estado de conservação
  const caixaConservacao = criarCaixaGrafico('Espécies por Estado de Conservação');
  const canvasConservacao = document.createElement('canvas');
  canvasConservacao.width = 220;
  canvasConservacao.height = 220;
  caixaConservacao.appendChild(canvasConservacao);
  asideContainer.appendChild(caixaConservacao);

  new Chart(canvasConservacao.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(data.seresPorStatus),
      datasets: [{
        data: Object.values(data.seresPorStatus),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0']
      }]
    },
    options: { responsive: false, plugins: { legend: { position: 'bottom' } } }
  });

  dashboard.appendChild(asideContainer);

  container.appendChild(dashboard);
}

// =======================
// Inicializa a página quando o DOM estiver pronto
// =======================
document.addEventListener('DOMContentLoaded', fetchInicio);
