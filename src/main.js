import "./style.css";
import { getUsers, getPostsByUser } from "./api.js";

const usersContainer = document.querySelector("#users");
const statusElement = document.querySelector("#status");
const searchInput = document.querySelector("#searchInput");

let users = [];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createUserCard(user) {
  const card = document.createElement("article");
  card.className = "user-card";

  card.innerHTML = `
    <div class="user-card__top">
      <div class="avatar">${escapeHtml(user.name.charAt(0))}</div>

      <div>
        <h3>${escapeHtml(user.name)}</h3>
        <p class="username">@${escapeHtml(user.username)}</p>
      </div>
    </div>

    <div class="user-info">
      <p><strong>E-mail:</strong> ${escapeHtml(user.email)}</p>
      <p><strong>Cidade:</strong> ${escapeHtml(user.address.city)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(user.company.name)}</p>
    </div>

    <button class="posts-button" type="button">
      Ver posts ↓
    </button>

    <div class="posts" hidden></div>
  `;

  const button = card.querySelector(".posts-button");
  const postsContainer = card.querySelector(".posts");

  button.addEventListener("click", async () => {
    const isOpen = !postsContainer.hidden;

    if (isOpen) {
      postsContainer.hidden = true;
      button.textContent = "Ver posts ↓";
      return;
    }

    postsContainer.hidden = false;
    button.textContent = "Ocultar posts ↑";
    postsContainer.innerHTML =
      '<p class="loading">Carregando posts...</p>';

    try {
      const posts = await getPostsByUser(user.id);

      renderPosts(postsContainer, posts);
    } catch (error) {
      console.error(error);

      postsContainer.innerHTML =
        '<p class="error-message">Não foi possível carregar os posts.</p>';
    }
  });

  return card;
}

function renderPosts(container, posts) {
  if (!posts.length) {
    container.innerHTML = "<p>Nenhum post encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <div class="posts-header">
      <h4>Posts deste usuário</h4>
      <span>${posts.length} posts</span>
    </div>
  `;

  posts.forEach((post) => {
    const article = document.createElement("article");

    article.className = "post";

    article.innerHTML = `
      <h5>${escapeHtml(post.title)}</h5>
      <p>${escapeHtml(post.body)}</p>
    `;

    container.appendChild(article);
  });
}

function renderUsers(list) {
  usersContainer.innerHTML = "";

  if (!list.length) {
    usersContainer.innerHTML =
      '<div class="empty">Nenhum usuário encontrado.</div>';

    statusElement.textContent = "0 usuários encontrados";

    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach((user) => {
    fragment.appendChild(createUserCard(user));
  });

  usersContainer.appendChild(fragment);

  statusElement.textContent =
    `${list.length} usuários encontrados`;
}

function filterUsers() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term)
    );
  });

  renderUsers(filtered);
}

async function init() {
  try {
    statusElement.textContent = "Carregando usuários...";

    users = await getUsers();

    renderUsers(users);
  } catch (error) {
    console.error(error);

    statusElement.textContent =
      "Erro ao carregar os usuários.";

    usersContainer.innerHTML = `
      <div class="error-box">
        <h3>Não foi possível carregar os usuários.</h3>

        <p>
          Verifique sua conexão com a internet e tente novamente.
        </p>

        <button id="retryButton">
          Tentar novamente
        </button>
      </div>
    `;

    document
      .querySelector("#retryButton")
      .addEventListener("click", init);
  }
}

searchInput.addEventListener("input", filterUsers);

init();
