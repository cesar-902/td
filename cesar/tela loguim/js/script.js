// Evento para submissão do formulário de login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Autenticação básica
    if (username === "admin" && password === "1234") {
        alert("Login realizado com sucesso!");
    } else {
        alert("Usuário ou senha incorretos!");
    }
});

// Evento para redirecionar para a página de cadastro
document.getElementById('createAccountBtn').addEventListener('click', function () {
    alert("Redirecionando para a página de cadastro...");
    window.location.href = "http://127.0.0.1:5500/registro.html"; // Página de registro
});
