document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById("nome");
    const descricaoInput = document.getElementById("descricao");
    const dataLimiteInput = document.getElementById("limit-date");
    const limitTimeInput = document.getElementById("limit-time");
    const pausesInput = document.getElementById("pauses");
    const emailInput = document.getElementById("emails");
    const usersList = document.getElementById("users");
    const IntervaloInput = document.getElementById("intervalo");
    const IntervaloList = document.getElementById("pauses");
    const tagsInput = document.getElementById("tags");
    const tagsList = document.getElementById("tags-criadas");
    const filterIcon = document.getElementById("filter-icon");
    const filterMenu = document.getElementById("filter-menu");
    const TarefaElement = document.querySelector(".colunas");

    const dataLimiteValue = dataLimiteInput.value + ` ` + limitTimeInput.value;
    let isEdit = false; // Indica se está em modo de edição
    let editTaskId = null; // ID da tarefa sendo editada


    let idUsuario = dadosUsuarioLogado.id;

    const overlays = document.querySelectorAll(".overlay");
    const closeOverlay = (id) =>
        (document.getElementById(id).style.display = "none");
    console.log(idUsuario);

    // Recuperar
    const tasks = [];
    let taskId = 0;

    fetch("http://localhost:3000/tarefas")
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                const userTasks = data.filter((task) => task.userID === idUsuario);
                tasks.push(...userTasks);
                loadTasks();
            }
        })
        .catch((error) => console.error("Erro ao carregar tarefas:", error));

    const loadTasks = () => {
        TarefaElement.innerHTML = ""; 

        const pendingTasks = tasks.filter((task) => task.status === "Pendente");

        pendingTasks.forEach((task) => addDiv(task));
    };
    fetch("http://localhost:3000/config")
        .then((response) => response.json())
        .then((data) => {
            if (data.taskId !== undefined) {
                taskId = data.taskId;
                console.log("Task ID carregado:", taskId);
            }
        });

    //data minima
    function dataMinima() {
        const formattedDate = data();
        const dataAtual = document.getElementById("limit-date");
        const [date, time] = formattedDate.split(" ");
        dataAtual.setAttribute("min", date);
    }

    // Data atual
    function data() {
        const newDate = new Date();
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const day = String(newDate.getDate()).padStart(2, "0");
        const hours = String(newDate.getHours()).padStart(2, "0");
        const minutes = String(newDate.getMinutes()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        return formattedDate;
    }
    // Função para abrir overlay
    document.querySelectorAll(".overlay-trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const overlay = document.getElementById(trigger.dataset.overlay);
            if (overlay) overlay.style.display = "flex";
        });
    });

    // Fechar overlay quando clica fora
    overlays.forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            if (e.target.classList.contains("close-btn") || e.target === overlay) {
                overlay.style.display = "none";
            }
        });
    });

    // Função para adicionar repetição
    const RepeticaoList = document.getElementById("repeat");
    const addRepetition = () => {
        const tipo = document.getElementById("tipo").selectedOptions[0].text;
        const repeticao = `${tipo}`;
        RepeticaoList.textContent = repeticao;
        closeOverlay("overlay-1");
    };

    // Função para adicionar tag
    const addTag = () => {
        const tagsValue = tagsInput.value.trim();
        if (tagsValue.length <= 20) {
            if (
                tagsValue &&
                !Array.from(tagsList.getElementsByTagName("span")).some(
                    (tag) => tag.textContent.trim() === `#${tagsValue}`
                )
            ) {
                tagsList.innerHTML += `<span>#${tagsValue} </span>`;
                tagsInput.value = "";
            } else if (tagsValue) {
                alert("A tag já existe!");
            }
        } else {
            alert("O limite de caracteres é de 20!");
        }
    };

    // Função para validar e adicionar e-mail
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const addEmail = () => {
        const emailValue = emailInput.value.trim();
        if (emailValue && isValidEmail(emailValue)) {
            if (
                !Array.from(usersList.getElementsByTagName("span")).some(
                    (user) => user.textContent.trim() === emailValue
                )
            ) {
                usersList.innerHTML += `<span>${emailValue}</span> `;
                emailInput.value = "";
                closeOverlay("overlay-3");
            } else {
                alert("Este e-mail já está na lista!");
            }
        } else {
            alert("Por favor, insira um e-mail válido!");
        }
    };

    // Função para adicionar pausas
    const addPauses = () => {
        const IntervaloValue = IntervaloInput.value.trim();
        if (IntervaloValue && !isNaN(IntervaloValue)) {
            IntervaloList.textContent = `A cada ${IntervaloValue} Min`;
            closeOverlay("overlay-4");
        } else {
            alert("Digite apenas números!");
        }
    };

    //Apagar conteudo
    const removeElement = (element) => {
        element.remove();
    };

    // Adicionar evento de clique nas tags
    tagsList.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
            const confirmDelete = confirm("Você deseja apagar esta tag?");
            if (confirmDelete) {
                removeElement(e.target);
            }
        }
    });

    // Adicionar evento de clique nos emails
    usersList.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
            const confirmDelete = confirm("Você deseja apagar este e-mail?");
            if (confirmDelete) {
                removeElement(e.target);
            }
        }
    });

    // Adicionar evento de clique na repetição
    RepeticaoList.addEventListener("click", () => {
        const confirmDelete = confirm("Você deseja apagar esta repetição?");
        if (confirmDelete) {
            RepeticaoList.textContent = "";
        }
    });

    // Adicionar evento de clique no intervalo
    IntervaloList.addEventListener("click", () => {
        const confirmDelete = confirm("Você deseja apagar este intervalo?");
        if (confirmDelete) {
            IntervaloList.textContent = "";
        }
    });

    //////////////////////////////////////////////////////////

    //Salvar
    function salvarTasks(task) {
        console.log("Dados enviados para o servidor:", task);
        fetch("http://localhost:3000/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Erro ao salvar as tarefas: ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                tasks.push(data);
                loadTasks();
                console.log("Tarefa salva com sucesso", data);
            })
            .catch((error) => {
                console.error("Erro ao salvar as tarefas:", error);
                alert("Erro ao salvar a tarefa. Verifique sua conexão ou o servidor.");
            });
    }
    function salvarTaskId(taskId) {
        fetch("http://localhost:3000/config", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Erro ao salvar a configuração: ${res.statusText}`);
                }
                return res.json();
            })
            .then(() => {
                console.log(`Task ID ${taskId} salvo com sucesso no backend.`);
            })
            .catch((error) => {
                console.error("Erro ao salvar o taskId no backend:", error);
                alert("Erro ao atualizar o ID da tarefa. Tente novamente.");
            });
    }
    //Adicionar Div

    const addDiv = (task) => {
        const TarefaValue = document.createElement("div");
        TarefaValue.classList.add("tarefa");
        TarefaValue.dataset.taskId = task.id;
        TarefaValue.innerHTML = `<h3>${task.title}</h3>`;
        TarefaElement.appendChild(TarefaValue);
        TarefaValue.addEventListener("click", () => showTasks(task));
    };

    // Adicionar tarefa
    const addTarefas = () => {
        const nomeValue = nomeInput.value.trim();
        const dataLimiteValue = dataLimiteInput.value.trim() + ` ` + limitTimeInput.value.trim();

        if (!nomeValue || !dataLimiteInput.value || !limitTimeInput.value) {
            alert("Preencha todos os campos obrigatórios: Nome e Data Limite.");
            return;
        }

        taskId++;
        const newTask = {
            id: taskId,
            userID: idUsuario,
            title: nomeValue,
            description: descricaoInput.value.trim(),
            start: new Date().toISOString(),
            end: dataLimiteValue,
            repeticao: RepeticaoList.textContent,
            tags: Array.from(tagsList.getElementsByTagName("span")).map((tag) => tag.textContent.trim()),
            emails: Array.from(usersList.getElementsByTagName("span")).map((email) => email.textContent.trim()),
            pausas: IntervaloList.textContent,
            deletado: false,
            progresso: 0,
            status: "Pendente",
        };

        salvarTasks(newTask);
        salvarTaskId(taskId);
        addDiv(newTask);
        ResetValue();
    };


    //Reseta valores
    function ResetValue() {
        nomeInput.value = "";
        descricaoInput.value = "";
        RepeticaoList.innerHTML = "";
        tagsList.innerHTML = "";
        usersList.innerHTML = "";
        IntervaloList.innerHTML = "";
        dataLimiteInput.value = "";
        limitTimeInput.value = "";
    }
    ////////////////////Selecionar////////////////////////////

    const addSpan = (spanId, elements) => {
        const span = document.getElementById(spanId);
        span.innerHTML = "";

        elements.forEach((element) => {
            span.innerHTML += `<span>${element}</span> `;
        });
    };

    const showTasks = (task) => {
        if (isEdit) {
            isEdit = false;
            editTaskId = null;
            ResetValue();
        } else {
            nomeInput.value = task.title;
            descricaoInput.value = task.description;
            dataLimiteInput.value = task.end.split(" ")[0];
            limitTimeInput.value = task.end.split(" ")[1];
            RepeticaoList.textContent = task.repeticao;
            addSpan("tags-criadas", task.tags);
            addSpan("users", task.emails);
            IntervaloList.textContent = task.pausas;
            isEdit = true;
            editTaskId = task.id;
        }
    };
    ///////////////////Atualizar////////////////////////////////

    const updateTask = () => {
        if (!isEdit || editTaskId === null) {
            alert("Selecione uma tarefa para editar.");
            return;
        }

        const nomeValue = nomeInput.value.trim();
        if (!nomeValue) {
            alert("O campo nome não pode estar vazio.");
            return;
        }

        const dataLimiteValue = dataLimiteInput.value + ` ` + limitTimeInput.value;
        const taskIndex = tasks.findIndex((task) => task.id === editTaskId);

        if (taskIndex !== -1) {
            const updatedTask = {
                ...tasks[taskIndex],
                title: nomeValue,
                description: descricaoInput.value.trim(),
                end: dataLimiteValue,
                repeticao: RepeticaoList.textContent,
                tags: Array.from(tagsList.getElementsByTagName("span")).map((tag) => tag.textContent.trim()),
                emails: Array.from(usersList.getElementsByTagName("span")).map((email) => email.textContent.trim()),
                pausas: IntervaloList.textContent,
            };

            fetch(`http://localhost:3000/tarefas/${editTaskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erro ao atualizar a tarefa: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    tasks[taskIndex] = updatedTask;
                    loadTasks();
                    ResetValue();
                    console.log("Tarefa atualizada com sucesso!");
                })
                .catch((error) => console.error("Erro ao atualizar a tarefa:", error));
        }
    };


    function cancelEdit() {
        isEdit = false;
        editTaskId = null;
    }

    document
        .querySelector(".acoes.atualizar")
        .addEventListener("click", updateTask);
    /////////////////////////////////
    // Deletar
    const deleteTask = () => {
        const taskIndex = tasks.findIndex((task) => task.id === editTaskId);
        if (taskIndex !== -1) {
            if (confirm("Você tem certeza?")) {
                fetch(`http://localhost:3000/tarefas/${editTaskId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `Erro ao excluir a tarefa: ${response.statusText}`
                            );
                        }
                        return response;
                    })
                    .then(() => {
                        tasks.splice(taskIndex, 1);
                        ResetValue();
                        TarefaElement.innerHTML = "";
                        nomeInput.value = "";
                        alert("Tarefa excluída com sucesso");
                        cancelEdit();
                        loadTasks();
                    });
            }
        } else {
            alert("Selecione uma tarefa");
        }
    };

    // Adiciona o evento de clique ao botão de exclusão
    document
        .querySelector(".acoes.deletar")
        .addEventListener("click", deleteTask);

    /////////////////////////Filtro/////////////////////////////////

    // Alterna a visibilidade do menu de filtro
    filterIcon.addEventListener("click", () => {
        filterMenu.style.display =
            filterMenu.style.display === "none" ? "block" : "none";
    });

    // Aplica o filtro com base na seleção do usuário
    document.getElementById("apply-filter").addEventListener("click", () => {
        const ordem = document.getElementById("filtro-status").value;
        filterTasks(ordem);
        filterMenu.style.display = "none";
    });

    // Função de filtro e ordenação de tarefas
    function filterTasks(ordem) {
        const tarefasElements = Array.from(
            document.querySelectorAll(".colunas .tarefa")
        );
        let sortedTasks;
        // Ordenar as tarefas
        switch (ordem) {
            case "mais-recente":
                sortedTasks = tarefasElements.sort((a, b) => {
                    const idA = parseInt(
                        tasks.find(
                            (task) => task.title === a.querySelector("h3").textContent
                        )?.id
                    );
                    const idB = parseInt(
                        tasks.find(
                            (task) => task.title === b.querySelector("h3").textContent
                        )?.id
                    );
                    return idB - idA;
                });
                break;

            case "mais-antigo":
                sortedTasks = tarefasElements.sort((a, b) => {
                    const idA = parseInt(
                        tasks.find(
                            (task) => task.title === a.querySelector("h3").textContent
                        )?.id
                    );
                    const idB = parseInt(
                        tasks.find(
                            (task) => task.title === b.querySelector("h3").textContent
                        )?.id
                    );
                    return idA - idB;
                });
                break;

            case "alfabetico":
                sortedTasks = tarefasElements.sort((a, b) => {
                    return a
                        .querySelector("h3")
                        .textContent.localeCompare(b.querySelector("h3").textContent);
                });
                break;

            default:
                sortedTasks = tarefasElements;
        }

        // Atualiza a exibição das tarefas na página
        const TarefaElement = document.querySelector(".colunas");
        TarefaElement.innerHTML = "";
        sortedTasks.forEach((taskElement) =>
            TarefaElement.appendChild(taskElement)
        ); // Adiciona as tarefas ordenadas
    }
    /////////////////////Adicionar eventos//////////////////////////

    const addButtonEvent = (selector, action) =>
        document.querySelector(selector).addEventListener("click", action);
    const addEnterEvent = (inputSelector, action) => {
        document.querySelector(inputSelector).addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                action();
            }
        });
    };
    //Fechar overlay com ESC
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            overlays.forEach((overlay) => {
                closeOverlay(overlay.id);
            });
        }
    });
    addButtonEvent("#overlay-1 .ok", addRepetition);
    addButtonEvent("#overlay-2 .ok", addTag);
    addButtonEvent("#overlay-3 .ok", addEmail);
    addButtonEvent("#overlay-4 .ok", addPauses);
    addEnterEvent("#tags", addTag);
    addEnterEvent("#emails", addEmail);
    addEnterEvent("#intervalo", addPauses);
    addButtonEvent(".adicionar", addTarefas);

    //Chama a função de carregar tarefas ao carregar a página
    window.addEventListener("load", () => {
        loadTasks();
        dataMinima(); // Chama a função para definir a data mínima
    });
});
