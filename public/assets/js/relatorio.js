// Obtém o usuário logado a partir do sessionStorage
let idUsuario = dadosUsuarioLogado.id;

// Calcula o primeiro e o último dia da semana atual
const hoje = new Date();
const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

const primeiroDiaSemana = new Date(hoje);
primeiroDiaSemana.setDate(hoje.getDate() - (diaSemana === 0 ? 6 : (diaSemana - 1))); // Ajusta para segunda-feira
primeiroDiaSemana.setHours(0, 0, 0, 0); // Define início do dia

const ultimoDiaSemana = new Date(primeiroDiaSemana);
ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 6); // Ajusta para domingo
ultimoDiaSemana.setHours(23, 59, 59, 999); // Define fim do dia

// Função para processar tarefas por status
function processarTarefas(url, label, color) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(tarefas => {
      const tarefasPorDia = [0, 0, 0, 0, 0, 0, 0];

      tarefas.filter(tarefa => {
        let data = new Date(tarefa.end || tarefa.start); // Considera data de início ou conclusão
        return data >= primeiroDiaSemana && data <= ultimoDiaSemana;
      }).forEach(tarefa => {
        let data = new Date(tarefa.end || tarefa.start);
        if (!isNaN(data)) {
          let day = data.getDay();
          let indice = day === 0 ? 6 : day - 1;
          tarefasPorDia[indice]++;
        }
      });

      return { label, data: tarefasPorDia, color };
    });
}

// URLs para obter tarefas
const urls = [
  { url: `http://localhost:3000/tarefas?status=Concluída&userID=${idUsuario}`, label: 'Concluídas', color: 'rgba(75, 192, 192, 0.5)' },
  { url: `http://localhost:3000/tarefas?status=Pendente&userID=${idUsuario}`, label: 'Pendentes', color: 'rgba(255, 99, 132, 0.5)' }
];

// Processa ambas as requisições e exibe o gráfico
Promise.all(urls.map(u => processarTarefas(u.url, u.label, u.color)))
  .then(datasets => {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
        datasets: datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.color,
          borderColor: ds.color.replace('0.5', '1'),
          borderWidth: 1
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Tarefas Pendentes e Concluídas por Dia da Semana'
          }
        }
      }
    });
  })
  .catch(error => console.error('Erro ao buscar tarefas:', error.message || error));
