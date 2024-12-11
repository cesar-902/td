let tasks = []; // Para armazenar tarefas do usuário logado

// Obtém o usuário logado do sessionStorage
let idUsuario = dadosUsuarioLogado.id;

// Carregar Tarefas do Servidor
fetch(`http://localhost:3000/tarefas?userID=${idUsuario}&status=Pendente`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    // Filtrar tarefas para o usuário logado
    tasks = data.filter(tarefa => tarefa.userID === idUsuario);
    console.log('Tarefas do usuário logado carregadas:', tasks);

    // Criar calendário com as tarefas filtradas
    criarCalendario();
  })
  .catch(error => console.error('Erro na requisição:', error));

// Sidebar
function mostrarMenu() {
  const menuIcon = document.getElementById('menu-icon');
  const sidebar = document.getElementById('sidebar');

  menuIcon.classList.toggle('fixed');
  sidebar.classList.toggle('show');
}

// Formatar data no estilo dd/mm/yyyy
function formatData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos} de ${dia}/${mes}/${ano}`;
}

// Mostrar data atual
function data() {
  const dataAtual = document.getElementById('data-atual');
  const dia = new Date();
  const formatarDia = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  });
  const diaAtual = formatarDia.format(dia);
  dataAtual.innerText = diaAtual;
}

// Criar calendário com as tarefas do usuário logado
function criarCalendario() {
  const calendar = createCalendar({
    ...config,
    events: [...tasks],
  });
  calendar.render(document.querySelector('.calendar'));
  data();
}

// Configuração do calendário
const { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek, createCalendar } = window.SXCalendar;

const config = {
  locale: 'pt-BR',
  firstDayOfWeek: 1,
  views: [createViewDay(), createViewMonthAgenda(), createViewMonthGrid(), createViewWeek()],
  defaultView: createViewMonthGrid(),
  weekOptions: {
    gridHeight: 900,
    nDays: 5,
    eventWidth: 95,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
  },
  monthGridOptions: {
    nEventsPerDay: 8,
  },
  isResponsive: true,
  events: [...tasks],
  callbacks: {
    onEventClick(calendarEvent) {
      console.log(calendarEvent);
      mostrarTarefa(calendarEvent);
    },
  },
};

// Mostrar tarefa no overlay
function mostrarTarefa(calendarEvent) {
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('overlay-title').textContent = calendarEvent.title;
  document.getElementById('overlay-details').textContent = `${calendarEvent.description}`;

  // Formatar data e hora de início e fim
  const dataInicio = new Date(calendarEvent.start);
  const dataFim = new Date(calendarEvent.end);
  const inicioFormatado = formatData(dataInicio);
  const fimFormatada = formatData(dataFim);

  document.getElementById('overlay-date').textContent = `${inicioFormatado} - ${fimFormatada}`;
  document.getElementById('overlay-emails').textContent = calendarEvent.emails;
  adicionarTags(calendarEvent.tags);
}

// Adicionar tags no overlay
function adicionarTags(tags) {
  const container = document.getElementById('overlay-tags');
  container.innerHTML = '';

  tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.classList.add('tag');
    tagElement.textContent = tag;

    container.appendChild(tagElement);
  });
}

// Fechar overlay
function fecharTarefa(event) {
  if (event.target.id === 'overlay') {
    document.getElementById('overlay').style.display = 'none';
  }
}
