let dadosUsuarioLogado = null;
try{
    dadosUsuarioLogado = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
}
catch(err){
    console.error("Erro ao carregar dados do usuário logado", err);
}

if (dadosUsuarioLogado == null) {
    window.location.href = "/codigo/public/login.html";
}