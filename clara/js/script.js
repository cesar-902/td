const body = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const menuBtn = document.querySelector(".menu-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const mainContent = document.querySelector(".container-main"); // Seleciona o container principal

menuBtn.onclick = () => {
  navbar.classList.add("show");
  menuBtn.classList.add("hide");
  body.classList.add("disabled");
};

cancelBtn.onclick = () => {
  body.classList.remove("disabled");
  navbar.classList.remove("show");
  menuBtn.classList.remove("hide");
};

window.onscroll = () => {
  this.scrollY > 20 ? navbar.classList.add("sticky") : navbar.classList.remove("sticky");
  ajustarPadding(); // Ajusta o padding top ao rolar a página
};

// Ajusta o padding-top do conteúdo principal para evitar sobreposição
function ajustarPadding() {
  const navbarHeight = navbar.offsetHeight; // Calcula a altura atual da navbar
  const extraSpacing = 100; // Espaçamento extra que você quer adicionar
  mainContent.style.paddingTop = (navbarHeight + extraSpacing) + "px"; // Define o padding-top com o espaçamento adicional
}

// Chama a função para ajustar o padding assim que a página carregar
document.addEventListener("DOMContentLoaded", ajustarPadding);
window.addEventListener("resize", ajustarPadding); // Ajusta o padding ao redimensionar a janela

/* Função copiar */
function copyToClipboard() {
  const link = document.getElementById("profile-link").href;
  navigator.clipboard.writeText(link).then(() => {
      alert("Link copiado para a área de transferência!");
  }).catch(err => {
      console.error("Erro ao copiar o link: ", err);
  });
}

// Função para salvar amigos no Local Storage
function saveFriendsToLocalStorage(friends) {
  localStorage.setItem('friends', JSON.stringify(friends));
}

// Função para carregar amigos do Local Storage
function loadFriendsFromLocalStorage() {
  const savedFriends = localStorage.getItem('friends');
  return savedFriends ? JSON.parse(savedFriends) : [];
}

// Função para renderizar os amigos na lista
function renderFriendList(friends) {
  const friendList = document.getElementById("friend-list");
  friendList.innerHTML = ""; // Limpa a lista antes de renderizar

  friends.forEach((friendName, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.classList.add("friend-btn");
      button.innerHTML = `<span><i class="fa fa-user"></i> ${friendName}</span>`;

      // Botão de excluir
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i class="fa fa-trash"></i>`;
      
      // Função para remover amigo
      deleteBtn.addEventListener("click", function() {
          friends.splice(index, 1); // Remove o amigo do array
          saveFriendsToLocalStorage(friends); // Atualiza o Local Storage
          renderFriendList(friends); // Re-renderiza a lista
      });

      button.appendChild(deleteBtn);
      li.appendChild(button);
      friendList.appendChild(li);
  });
}

// Abrir e fechar modal
const modal = document.getElementById("myModal");
const openAddFriendModal = document.getElementById("openAddFriendModal");
const closeModalBtn = document.getElementsByClassName("close")[0];

openAddFriendModal.onclick = function () {
  modal.style.display = "block";
}

closeModalBtn.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

// Carregar amigos do Local Storage ao carregar a página
let friends = loadFriendsFromLocalStorage();
renderFriendList(friends);

// Função para adicionar amigo
document.getElementById("addFriendConfirm").addEventListener("click", function() {
  const friendNameInput = document.getElementById("friend-name");
  const friendName = friendNameInput.value.trim();

  if (friendName !== "") {
      friends.push(friendName); // Adiciona o amigo ao array
      saveFriendsToLocalStorage(friends); // Salva o array no Local Storage
      renderFriendList(friends); // Atualiza a lista de amigos exibida

      // Limpa o campo de input e fecha o modal
      friendNameInput.value = "";
      modal.style.display = "none";
  }
});

