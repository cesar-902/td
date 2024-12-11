// Função para buscar as atividades do servidor JSON
async function fetchActivities() {
    try {
        const response = await fetch("http://localhost:3000/activities");
        const data = await response.json();
        const activitySelector = document.getElementById("activity");
        data.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.time;
            option.textContent = activity.name;
            activitySelector.appendChild(option);
        });
        resetTimer(); // Define o primeiro tempo
    } catch (error) {
        console.error("Erro ao carregar atividades:", error);
    }
}

// Função para adicionar um item ao histórico no JSON Server
async function addHistoryItem(success, activityName) {
    const status = success ? "Concluído" : "Não Concluído";

    const pomodoro = {
        status: status,
        activity: activityName
    };

    try {
        const response = await fetch("http://localhost:3000/pomodoros", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pomodoro)
        });
        const result = await response.json();
        console.log("Pomodoro adicionado ao histórico:", result);
    } catch (error) {
        console.error("Erro ao adicionar Pomodoro ao histórico:", error);
    }

    // Atualiza a tabela de histórico na interface
    const tableBody = document.getElementById("historyTableBody");
    const row = document.createElement("tr");
    row.className = success ? "success-row" : "failure-row";
    row.innerHTML = `
        <td>${activityName}</td>
        <td>${status}</td>
    `;
    tableBody.prepend(row);
}

// Chama a função fetchActivities para carregar atividades ao carregar a página
fetchActivities();
