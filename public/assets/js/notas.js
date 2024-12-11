const API_ENDPOINT = "http://localhost:3000";

const notasSection = document.querySelector("#lista-notas");
const form = document.querySelector("#form-notas");

const idUsuario = dadosUsuarioLogado.id;

const obterNotas = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notas`);
    if (!response.ok) throw new Error("Erro ao obter notas.");

    const tasks = await response.json();
    return tasks.filter((nota) => nota.userID === idUsuario); // Filtra pelas notas do usuário logado
  } catch (error) {
    console.error("Erro ao obter notas:", error);
    return [];
  }
};

const renderizarNotas = (notas) => {
  const tabela = `
    <table class="table table-hover p-5 m-2">
      <thead>
        <tr>
          <th>Título</th>
          <th>Matéria</th>
          <th>Prioridade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${notas
          .map(
            (nota) => `
          <tr>
            <td onclick="abrirDetalhes('${nota.id}')" style="cursor: pointer; text-decoration: underline;">
              ${nota.title}
            </td>
            <td>${nota.role}</td>
            <td>${obterPrioridade(Number(nota.priority))}</td>
            <td>
              <button class="btn btn-danger" onClick="excluirNota('${nota.id}')">
                <span class="fa-solid fa-trash"></span>
              </button>
              <button class="btn btn-primary" onClick="preencherFormularioEdicao(${JSON.stringify(
                nota
              ).replace(/"/g, '&quot;')})">
                <span class="fa-solid fa-edit"></span>
              </button> 
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  notasSection.innerHTML = tabela;
};

const abrirDetalhes = (id) => {
  sessionStorage.setItem("id", id); // Armazena o ID no sessionStorage
  window.location.href = "notaDetalhada.html"; // Redireciona para a página de detalhes
};

const preencherFormularioEdicao = (nota) => {
  console.log("Nota recebida para edição:", nota);

  if (!nota || !nota.id) {
    console.error("Nota inválida para edição:", nota);
    alert("Erro ao carregar os dados da nota para edição.");
    return;
  }

  form["input-titulo"].value = nota.title || "";
  form["input-materia"].value = nota.role || "";
  form["input-descricao"].value = nota.description || "";
  form["input-prioriadade"].value = nota.priority || "";

  form.dataset.editingId = nota.id; // Atribui o ID ao dataset
  console.log("ID atribuído ao formulário para edição:", form.dataset.editingId);
};

const criarNota = async (e) => {
  e.preventDefault();

  const title = form["input-titulo"].value.trim();
  const role = form["input-materia"].value.trim();
  const description = form["input-descricao"].value.trim();
  const priority = form["input-prioriadade"].value.trim();

  if (!title || !role || !description || !priority) {
    alert("Por favor, preencha todos os campos antes de enviar.");
    return;
  }

  const nota = {
    title,
    role,
    description,
    priority,
    userID: idUsuario,
  };

  

  if (form.dataset.editingId) {
    console.log("Editando nota com ID:", editingId);
    await atualizarNota(form.dataset.editingId, nota);
    delete form.dataset.editingId; // Limpa o ID após edição
  } else {
    await criarNovaNota(nota);
  }

  form.reset();
};

const criarNovaNota = async (nota) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/notas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nota),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar nota.");
    }

    const notaCriada = await response.json();

    if (notaCriada && notaCriada.id) {
      sessionStorage.setItem("id", notaCriada.id);
      alert("Nota criada com sucesso!");
      window.location.href = "notaDetalhada.html";
    } else {
      throw new Error("Nota criada, mas ID não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    alert("Erro ao criar nota. Tente novamente.");
  }
};

const atualizarNota = async (id, body) => {
  console.log(form.dataset.editingId, body);
  
  if (!id) {
    console.error("ID para atualização não foi fornecido.");
    alert("Erro: não foi possível identificar a nota a ser atualizada.");
    return;
  }

  try {
    console.log("Atualizando nota com ID:", id);
    console.log("Dados enviados:", body);

    const response = await fetch(`${API_ENDPOINT}/notas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar nota: ${response.statusText} - ${errorText}`);
    }

    const notaAtualizada = await response.json();
    alert(`Nota "${notaAtualizada.title}" atualizada com sucesso!`);
    main(); // Recarregar as notas
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    alert("Erro ao atualizar a nota. Verifique o servidor.");
  }
};

const excluirNota = async (id) => {
  const confirmar = confirm("Tem certeza de que deseja excluir esta nota?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${API_ENDPOINT}/notas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir nota: ${response.statusText}`);
    }

    alert("Nota excluída com sucesso!");
    main();
  } catch (error) {
    console.error("Erro ao excluir nota:", error);
    alert("Erro ao excluir a nota. Tente novamente.");
  }
};

const obterPrioridade = (prioridade) => {
  switch (prioridade) {
    case 1:
      return "Baixa";
    case 2:
      return "Média";
    case 3:
      return "Alta";
    default:
      return "Desconhecida";
  }
};

const main = async () => {
  try {
    const notas = await obterNotas();
    if (notas.length > 0) {
      renderizarNotas(notas);
    } else {
      notasSection.innerHTML = "Nenhuma nota cadastrada";
    }
  } catch (error) {
    notasSection.innerHTML = "Erro ao carregar as notas. Tente novamente.";
    console.error(error);
  }
};

main();

form.addEventListener("submit", criarNota);
