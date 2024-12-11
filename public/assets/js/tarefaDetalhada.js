document.addEventListener("DOMContentLoaded", () => {
    const idSpan = document.getElementById("id-item");
    const nomeSpan = document.getElementById("nome");
    const descriptionSpan = document.getElementById("description");
    const startSpan = document.getElementById("start-date");
    const endSpan = document.getElementById("end-date");
    const repeticaoSpan = document.getElementById("repeticao");
    const tagsSpan = document.getElementById("tags");
    const emailsSpan = document.getElementById("emails");
    const pausasSpan = document.getElementById("pausas");
    const statusSpan = document.getElementById("status");
    const progressoSpan = document.getElementById("progresso");

    const tarefaId = sessionStorage.getItem("tarefaId");

    if (!tarefaId) {
        alert("Nenhuma tarefa selecionada!");
        return;
    }

    fetch(`http://localhost:3000/tarefas/${tarefaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar a tarefa");
            }
            return response.json();
        })
        .then(tarefa => {
            idSpan.textContent = tarefa.id;
            nomeSpan.textContent = tarefa.title;
            descriptionSpan.textContent = tarefa.description || "Não informado";
            startSpan.textContent = tarefa.start ? formatarData(tarefa.start) : "Não informado";
            endSpan.textContent = tarefa.end ? formatarData(tarefa.end) : "Não informado";
            repeticaoSpan.textContent = tarefa.repeticao || "Sem repetição";
            tagsSpan.textContent = tarefa.tags.length > 0 ? tarefa.tags.join(", ") : "Sem tags";
            emailsSpan.textContent = tarefa.emails.length > 0 ? tarefa.emails.join(", ") : "Sem participantes";
            pausasSpan.textContent = tarefa.pausas || "Sem pausas";
            statusSpan.textContent = tarefa.status || "Pendente";
            progressoSpan.textContent = `${tarefa.progresso || 0}%`;
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao carregar os detalhes da tarefa.");
        });

    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        });
    }
});
