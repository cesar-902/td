let tasks = []; // Declarada uma única vez

let idUsuario = dadosUsuarioLogado.id; // ID do usuário logado

// Função para formatar o dia
function formatarDia(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(data);
}

// Função que retorna as tarefas para um dia específico
function obterTarefasParaDia(dia) {
  return tasks.filter(tarefa => {
    const endDate = new Date(tarefa.end);
    return endDate.toDateString() === dia.toDateString();
  });
}

// Exibir próximos dias
function exibirProximosDias() {
  const proximosDiasContainer = document.getElementById('proximos-dias');
  const hoje = new Date();

  for (let i = 1; i <= 3; i++) {
    const proximoDia = new Date(hoje);
    proximoDia.setDate(hoje.getDate() + i);
    const diaFormatado = formatarDia(proximoDia);

    const divDia = document.createElement('div');
    divDia.classList.add('proximo-dia');
    const tituloDia = document.createElement('h2');
    tituloDia.innerText = diaFormatado;
    divDia.appendChild(tituloDia);

    const tarefasDia = obterTarefasParaDia(proximoDia);
    tarefasDia.forEach(tarefa => {
      const tarefaDiv = document.createElement('div');
      tarefaDiv.classList.add('tarefa-dia');
      tarefaDiv.innerHTML = `
        <a class="d-flex">
          <i onclick="concluirTarefa(${tarefa.id})" class="bi bi-circle"></i>
          <h4>${tarefa.title}</h4>
        </a>
      `;

      const tituloTarefa = tarefaDiv.querySelector('h4');
      tituloTarefa.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o evento clique no `tarefaDiv` também seja disparado
        sessionStorage.setItem('tarefaId', tarefa.id);
        window.location.href = 'tarefaDetalhada.html';
      });
      divDia.appendChild(tarefaDiv);
    });

    proximosDiasContainer.appendChild(divDia);
  }
}

// Exibir tarefas atrasadas
function exibirTarefasAtrasadas() {
  const tarefasAtrasadasContainer = document.getElementById('tarefasAtrasadas');
  const hoje = new Date();

  tarefasAtrasadasContainer.innerHTML = '';

  const tituloDia = document.createElement('h2');
  tituloDia.innerHTML = "Atrasadas:";
  tarefasAtrasadasContainer.appendChild(tituloDia);

  const tarefasAtrasadas = tasks.filter(tarefa => {
    const endDate = new Date(tarefa.end);
    return endDate < hoje && tarefa.status !== 'Concluída';
  });

  tarefasAtrasadas.forEach(tarefa => {
    const tarefaDiv = document.createElement('div');
    tarefaDiv.classList.add('tarefa-dia');
    tarefaDiv.innerHTML = `
      <div class="d-flex">
        <i onclick="concluirTarefa(${tarefa.id})" class="bi bi-circle"></i>
        <h4>${tarefa.title}</h4>
      </div>
    `;
    const tituloTarefa = tarefaDiv.querySelector('h4');
      tituloTarefa.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o evento clique no `tarefaDiv` também seja disparado
        sessionStorage.setItem('tarefaId', tarefa.id);
        window.location.href = 'tarefaDetalhada.html';
      });
    tarefasAtrasadasContainer.appendChild(tarefaDiv);
  });
}

// Exibir tarefas de hoje
function exibirTarefasDeHoje() {
  const tarefasDeHojeContainer = document.getElementById('atual');
  const hoje = new Date();
  tarefasDeHojeContainer.innerHTML = '';

  const dataAtual = document.createElement('h2');
  const diaAtual = formatarDia(hoje);
  dataAtual.innerText = `Hoje, ${diaAtual}`;
  tarefasDeHojeContainer.appendChild(dataAtual);

  const tarefasDeHoje = tasks.filter(tarefa => {
    const endDate = new Date(tarefa.end);
    return endDate.toDateString() === hoje.toDateString() && tarefa.status !== 'Concluída';
  });

  tarefasDeHoje.forEach(tarefa => {
    const tarefaDiv = document.createElement('div');
    tarefaDiv.classList.add('tarefa-dia');
    tarefaDiv.innerHTML = `
    <i onclick="concluirTarefa(${tarefa.id})" class="bi bi-circle"></i>
    <a class="d-flex">
        <h4>${tarefa.title}</h4>
      </a>
    `;
    const tituloTarefa = tarefaDiv.querySelector('h4');
      tituloTarefa.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o evento clique no `tarefaDiv` também seja disparado
        sessionStorage.setItem('tarefaId', tarefa.id);
        window.location.href = 'tarefaDetalhada.html';
      });
    tarefasDeHojeContainer.appendChild(tarefaDiv);
  });
}

// Carregar tarefas do JSON Server
function carregarTasks() {
  fetch(`http://localhost:3000/tarefas?userID=${idUsuario}&status=Pendente`)
    .then(response => response.json())
    .then(data => {
      tasks = [...data];
      exibirProximosDias();
      exibirTarefasAtrasadas();
      exibirTarefasDeHoje();
    })
    .catch(error => console.error('Erro ao carregar tarefas:', error));
}

// Concluir tarefa
function concluirTarefa(taskId) {
  const tarefa = tasks.find(t => t.id === taskId);
  event.preventDefault();
  if (tarefa) {
    const confirma = confirm("Deseja concluir tarefa");
    if (!confirma) return;
    else {
      tarefa.status = 'Concluída';
      fetch(`http://localhost:3000/tarefas/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Concluída' }),
      })
        .then(() => carregarTasks())
        .catch(error => console.error('Erro ao concluir tarefa:', error));
    }
  }
}

// Executar ao carregar a página
window.addEventListener('load', carregarTasks);
