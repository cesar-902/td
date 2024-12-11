const API_URL = "http://localhost:3000/notas"; // URL do JSON Server

// Seletores dos elementos do formulário
const idInput = document.querySelector("#id-input");
const tituloInput = document.querySelector("#titulo-input");
const descricaoInput = document.querySelector("#descricao-input");
const prioridadeInput = document.querySelector("#prioridade-input");

// Função para carregar os detalhes da nota
const carregarDetalhes = async () => {
    const id = sessionStorage.getItem("id"); // Obtém o ID armazenado no sessionStorage
    if (!id) {
      alert("Nota não encontrada. Redirecionando...");
      window.location.href = "notas.html"; // Redireciona para a página principal
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Erro ao carregar a nota.");
      const nota = await response.json();
  
      // Valida a nota retornada
      if (nota && nota.id) {
        // Preenche os campos do formulário com os detalhes da nota
        idInput.value = nota.id;
        tituloInput.value = nota.title;
        descricaoInput.value = nota.description;
        prioridadeInput.value = nota.priority;
      } else {
        throw new Error("Nota inválida retornada pela API.");
      }
    } catch (error) {
      console.error("Erro ao carregar os detalhes da nota:", error);
      alert("Erro ao carregar os detalhes da nota.");
      window.location.href = "notas.html"; // Redireciona para a página principal
    }
  };
  

// Carrega os detalhes da nota ao abrir a página
window.addEventListener("load", carregarDetalhes);
