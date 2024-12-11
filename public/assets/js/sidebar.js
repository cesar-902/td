
function carregarNome() {
  var dados = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
  console.log(dados.login);
  document.getElementById("username").innerHTML = dados.login;
}

function mostrarMenu() {
    console.log("Menu aberto");
  
    const menuIcon = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
  
    menuIcon.classList.toggle('fixed');
    sidebar.classList.toggle('show');
  }

  window.addEventListener("load", carregarNome);