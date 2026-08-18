import "./style.css";

import {
  getUsers,
  getPostsByUser
} from "./api.js";

const usersContainer = document.querySelector("#users");
const status = document.querySelector("#status");
const searchInput = document.querySelector("#searchInput");

const state = {
  users: []
};

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function renderPosts(posts) {
  if (!posts.length) {
    return "<li class='no-posts'>Nenhum post encontrado.</li>";
  }

  return posts
    .map(
      post => `
        <li class="post-item">
          <h4>${post.title}</h4>
          <p>${post.body}</p>
        </li>
      `
    )
    .join("");
}

function renderUsers() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredUsers = state.users.filter(user => {
    const searchableText = `${user.name} ${user.email} ${user.username}`.toLowerCase();
    return searchableText.includes(searchTerm);
  });

  usersContainer.innerHTML = "";

  if (!filteredUsers.length) {
    usersContainer.innerHTML = `
      <div class="empty-state">
        Nenhum usuário encontrado.
      </div>
    `;
    return;
  }

  filteredUsers.forEach(user => {
    const card = document.createElement("article");
    card.className = "user-card";

    card.innerHTML = `
      <div class="user-header">
        <div>
          <p class="user-label">Usuário</p>
          <h3>${user.name}</h3>
        </div>

        <button
          class="toggle-posts"
          type="button"
          data-user-id="${user.id}"
        >
          Ver posts
        </button>
      </div>

      <div class="user-info">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
      </div>

      <ul class="post-list" hidden></ul>
    `;

    const button = card.querySelector(".toggle-posts");
    const postList = card.querySelector(".post-list");

    button.addEventListener("click", async () => {
      const isHidden = postList.hasAttribute("hidden");

      if (isHidden) {
        button.textContent = "Ocultar posts";
        postList.removeAttribute("hidden");

        if (!postList.dataset.loaded) {
          postList.dataset.loaded = "true";
          setStatus(`Carregando posts de ${user.name}...`);

          try {
            const posts = await getPostsByUser(user.id);
            postList.innerHTML = renderPosts(posts);
            setStatus(`${state.users.length} usuário(s) carregado(s)`);
          } catch (error) {
            console.error(error);
            postList.innerHTML = "<li class='no-posts'>Erro ao carregar os posts.</li>";
            setStatus("Não foi possível carregar os posts.", true);
          }
        }
      } else {
        button.textContent = "Ver posts";
        postList.setAttribute("hidden", "hidden");
      }
    });

    usersContainer.appendChild(card);
  });
}

async function carregarUsuarios() {
  setStatus("Carregando...");

  try {
    const users = await getUsers();
    state.users = users;
    renderUsers();
    setStatus(`${users.length} usuário(s) carregado(s)`);
  } catch (error) {
    console.error(error);
    setStatus("Não foi possível carregar os usuários.", true);
  }
}

searchInput.addEventListener("input", renderUsers);

carregarUsuarios();
