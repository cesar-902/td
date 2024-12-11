

function mostrarMenu(){
  console.log("Menu aberto");
  
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

//Tarefas
const tasks = [];

fetch('http://localhost:3000/db')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    if (Array.isArray(data.tarefas)) {
      data.tarefas.forEach(tarefa => {
        tasks.push(tarefa);
      });
      console.log('Tarefas carregadas com sucesso:', tasks);

      criarCalendario();

    } else {
      console.error('A chave "tarefas" não é um array ou não foi encontrada no JSON.');
    }
  })
  .catch(error => console.error('Erro na requisição:', error));

//Formatar data no estilo dd/mm/yyyy
function formatData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos} de ${dia}/${mes}/${ano}`;
}

//Dia atual
function data() {
  const dataAtual = document.getElementById('data-atual');
  const dia = new Date();
  const formatarDia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' });
  const diaAtual = formatarDia.format(dia);
  dataAtual.innerText = diaAtual;
}

function criarCalendario() {
  const calendar = createCalendar({
    ...config,
    events: [...tasks]
  });
  calendar.render(document.querySelector('.calendar'));
  data();
}

//Calendário
const { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek, createCalendar } = window.SXCalendar;
/*const { createEventModalPlugin } = window.SXEventModal;

const plugins = [
    createEventModalPlugin()
] */

const config = {
  //plugins,
  /*calendars: {
    personal: {
      colorName: 'personal',
      lightColors: {
        main: '#f9d71c',
        container: '#fff5aa',
        onContainer: '#594800',
      },
      darkColors: {
        main: '#fff5c0',
        onContainer: '#fff5de',
        container: '#a29742',
      },
    },
    puc: {
      colorName: 'puc',
      lightColors: {
        main: '#16ca6e',
        container: '#c7fde1',
        onContainer: '#07341d',
      },
      darkColors: {
        main: '#ffc0cc',
        onContainer: '#ffdee6',
        container: '#a24258',
      },
    },
  },*/
  locale: 'pt-BR',
  firstDayOfWeek: 1,
  views: [createViewDay(), createViewMonthAgenda(), createViewMonthGrid(), createViewWeek()],  // Inclui as visualizações no array, chamando cada função
  defaultView: createViewMonthGrid(),
  weekOptions: {
    gridHeight: 900,
    nDays: 5,
    eventWidth: 95,
    timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' }
  },
  monthGridOptions: {
    nEventsPerDay: 8
  },
  isResponsive: true,
  events: [...tasks],
  callbacks: {
    onEventClick(calendarEvent) {
      console.log(calendarEvent);
      mostrarTarefa(calendarEvent);
    }
  }
};

//Mostrar tarefa
function mostrarTarefa(calendarEvent) {
  document.getElementById("overlay").style.display = "flex";
  document.getElementById('overlay-title').textContent = calendarEvent.title;
  document.getElementById('overlay-details').textContent = `${calendarEvent.description}`;
  
  //Formatar data e hora de início e fim
  const dataInicio =  new Date(calendarEvent.start);
  const dataFim = new Date(calendarEvent.end);
  const inicioFormatado = formatData(dataInicio);
  const fimFormatada = formatData(dataFim);

  document.getElementById('overlay-date').textContent = `${inicioFormatado} - ${fimFormatada}`;
  document.getElementById('overlay-emails').textContent = calendarEvent.emails;
  adicionarTags(calendarEvent.tags);

}

//Adicionar tags
function adicionarTags(tags) {
  const container = document.getElementById("overlay-tags");
  container.innerHTML = "";

  tags.forEach(tag => {
    const tagElement = document.createElement("span");
    tagElement.classList.add("tag");
    tagElement.textContent = tag;

    container.appendChild(tagElement); // Adiciona a tag ao contêiner
  });
}

// Fechar overlay

function fecharTarefa(event) {
  if (event.target.id == "overlay") {
    document.getElementById("overlay").style.display = "none";
  }
}
