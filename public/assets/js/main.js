const tituloInput = document.querySelector("#titulo-input");
const descricaoInput = document.querySelector("#descricao-input");
const prioridadeInput = document.querySelector("#selecionar-input");
const novaNota = document.querySelector("#criar-botao");
const salvarNota = document.querySelector("#salvar-botao");
const excluirNota = document.querySelector("#excluir-botao");
const componentes = document.querySelector("#componentes");
const listaNotas = document.querySelector("#lista-notas");

const API_URL = "http://localhost:3000/notas"; // URL do JSON Server

// Exibe o formulário para criar uma nova nota
novaNota.addEventListener("click", () => {
    componentes.style.display = "block"; // Mostra o formulário
    tituloInput.value = ""; // Limpa os campos
    descricaoInput.value = "";
    prioridadeInput.value = "Baixa";
});

// Salva uma nova nota no JSON Server e a adiciona no aside
async function salvarNotas(event) {
    event.preventDefault();

    const novaNota = {
        title: tituloInput.value.trim(),
        description: descricaoInput.value.trim(),
        priority: prioridadeInput.value.trim(),
    };

    if (!novaNota.title || !novaNota.description) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novaNota),
        });

        if (!response.ok) throw new Error("Erro ao salvar a nota.");
        const notaSalva = await response.json();

        adicionarNotaNoAside(notaSalva); // Adiciona a nova nota ao aside
        componentes.style.display = "none"; // Oculta o formulário
    } catch (error) {
        console.error("Erro ao salvar a nota:", error);
        alert("Erro ao salvar a nota.");
    }
}

// Adiciona uma nota na lista do aside
function adicionarNotaNoAside(nota) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("nota-checkbox");
    checkbox.dataset.id = nota.id;

    const span = document.createElement("span");
    span.textContent = `${nota.title} (${nota.priority})`;

    // Adiciona o evento de clique para redirecionar à página detalhada
    span.addEventListener("click", () => {
        sessionStorage.setItem("id", nota.id); // Salva o ID no sessionStorage
        window.location.href = "./notaDetalhada.html"; // Redireciona
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    listaNotas.appendChild(li);
}

// Verifica se há checkboxes selecionados e exibe o botão "Excluir"
listaNotas.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll(".nota-checkbox");
    const algumSelecionado = Array.from(checkboxes).some((cb) => cb.checked);
    excluirNota.hidden = !algumSelecionado; // Exibe ou oculta o botão
});

// Função para excluir notas selecionadas
async function excluirNotas() {
    const checkboxes = document.querySelectorAll(".nota-checkbox:checked"); // Seleciona apenas os checkboxes marcados
    if (checkboxes.length === 0) {
        alert("Nenhuma nota selecionada para exclusão.");
        return;
    }

    const confirmacao = confirm(`Deseja realmente excluir ${checkboxes.length} nota(s)?`);
    if (!confirmacao) return;

    for (const checkbox of checkboxes) {
        const id = checkbox.dataset.id; // Obtém o ID da nota
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error(`Erro ao excluir a nota com ID ${id}.`);
            console.log(`Nota com ID ${id} excluída com sucesso.`);

            // Remove o item visualmente do DOM
            const li = checkbox.parentElement;
            listaNotas.removeChild(li);
        } catch (error) {
            console.error(`Erro ao excluir a nota com ID ${id}:`, error);
        }
    }

    // Após exclusão, oculta o botão "Excluir"
    excluirNota.hidden = true;
}

// Adiciona evento ao botão "Excluir"
excluirNota.addEventListener("click", excluirNotas);

// Carrega as notas com checkboxes
async function carregarListaDeNotas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar notas.");
        const data = await response.json();

        listaNotas.innerHTML = ""; // Limpa a lista antes de adicionar itens

        data.forEach((item) => adicionarNotaNoAside(item)); // Adiciona as notas na lista
    } catch (error) {
        console.error("Erro ao carregar notas:", error);
        alert("Erro ao carregar a lista de notas.");
    }
}

// Inicializa a lista de notas ao carregar a página
window.addEventListener("load", carregarListaDeNotas);

// Evento para salvar nova nota
salvarNota.addEventListener("click", salvarNotas);
