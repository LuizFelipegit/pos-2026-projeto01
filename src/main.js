import "./style.css";

import {
  buscarFilmes,
  buscarDetalhesFilme
} from "./api.js";


const moviesContainer =
  document.querySelector("#moviesContainer");

const loading =
  document.querySelector("#loading");

const error =
  document.querySelector("#error");

const empty =
  document.querySelector("#empty");

const searchInput =
  document.querySelector("#searchInput");

const searchButton =
  document.querySelector("#searchButton");

const movieModal =
  document.querySelector("#movieModal");

const movieDetails =
  document.querySelector("#movieDetails");

const closeModal =
  document.querySelector("#closeModal");

const modalOverlay =
  document.querySelector("#modalOverlay");

const tryAgain =
  document.querySelector("#tryAgain");


/**
 * Mostra o carregamento
 */
function mostrarLoading() {

  loading.classList.remove("hidden");

  error.classList.add("hidden");

  empty.classList.add("hidden");

  moviesContainer.innerHTML = "";
}


/**
 * Esconde o carregamento
 */
function esconderLoading() {

  loading.classList.add("hidden");
}


/**
 * Mostra erro
 */
function mostrarErro() {

  loading.classList.add("hidden");

  error.classList.remove("hidden");

  moviesContainer.innerHTML = "";
}


/**
 * Formata a data
 */
function formatarAno(data) {

  if (!data) {
    return "Ano desconhecido";
  }

  return data.substring(0, 4);
}


/**
 * Cria um card de filme
 */
function criarCard(filme) {

  const article =
    document.createElement("article");

  article.className = "movie-card";


  const imagem =
    filme.images?.jpg?.large_image_url ||
    filme.images?.jpg?.image_url ||
    "https://via.placeholder.com/300x450?text=Sem+Poster";


  const titulo =
    filme.title || "Título desconhecido";


  const nota =
    filme.score
      ? filme.score.toFixed(1)
      : "N/A";


  const ano =
    formatarAno(filme.aired?.from);


  const generos =
    filme.genres
      ?.slice(0, 2)
      .map(genero => genero.name)
      .join(" • ") ||
    "Filme";


  article.innerHTML = `

    <div class="poster-container">

      <img
        src="${imagem}"
        alt="Poster de ${titulo}"
        loading="lazy"
      >

      <div class="movie-score">
        ⭐ ${nota}
      </div>

    </div>


    <div class="movie-info">

      <span class="movie-year">
        ${ano}
      </span>

      <h3>
        ${titulo}
      </h3>

      <p>
        ${generos}
      </p>

      <button
        class="details-button"
        data-id="${filme.mal_id}"
      >
        Ver detalhes
      </button>

    </div>

  `;


  const button =
    article.querySelector(".details-button");


  button.addEventListener(
    "click",
    () => abrirDetalhes(filme.mal_id)
  );


  return article;
}


/**
 * Mostra os filmes na página
 */
function mostrarFilmes(filmes) {

  moviesContainer.innerHTML = "";

  empty.classList.add("hidden");


  if (!filmes.length) {

    empty.classList.remove("hidden");

    return;
  }


  filmes.forEach(filme => {

    const card =
      criarCard(filme);

    moviesContainer.appendChild(card);

  });
}


/**
 * Carrega os filmes
 */
async function carregarFilmes(pesquisa = "") {

  mostrarLoading();

  try {

    const filmes =
      await buscarFilmes(pesquisa);

    esconderLoading();

    mostrarFilmes(filmes);

  } catch (erro) {

    console.error(erro);

    mostrarErro();

  }

}


/**
 * Abre detalhes do filme
 */
async function abrirDetalhes(id) {

  movieModal.classList.remove("hidden");

  movieDetails.innerHTML = `

    <div class="modal-loading">

      <div class="spinner"></div>

      <p>
        Carregando informações...
      </p>

    </div>

  `;


  try {

    const filme =
      await buscarDetalhesFilme(id);


    const imagem =
      filme.images?.jpg?.large_image_url ||
      filme.images?.jpg?.image_url ||
      "https://via.placeholder.com/500x700";


    const nota =
      filme.score
        ? filme.score.toFixed(1)
        : "N/A";


    const ano =
      formatarAno(filme.aired?.from);


    const generos =
      filme.genres
        ?.map(genero => genero.name)
        .join(", ") ||
      "Não informado";


    const estudios =
      filme.studios
        ?.map(estudio => estudio.name)
        .join(", ") ||
      "Não informado";


    const sinopse =
      filme.synopsis ||
      "Sinopse não disponível.";


    movieDetails.innerHTML = `

      <div class="details">

        <img
          class="details-poster"
          src="${imagem}"
          alt="Poster de ${filme.title}"
        >


        <div class="details-info">

          <span class="details-label">
            FILME
          </span>

          <h2>
            ${filme.title}
          </h2>


          <div class="details-rating">

            <strong>
              ⭐ ${nota}
            </strong>

            <span>
              ${ano}
            </span>

          </div>


          <p class="details-synopsis">
            ${sinopse}
          </p>


          <div class="details-data">

            <div>

              <strong>
                Gêneros
              </strong>

              <span>
                ${generos}
              </span>

            </div>


            <div>

              <strong>
                Duração
              </strong>

              <span>
                ${filme.duration || "Não informado"}
              </span>

            </div>


            <div>

              <strong>
                Estúdio
              </strong>

              <span>
                ${estudios}
              </span>

            </div>


            <div>

              <strong>
                Status
              </strong>

              <span>
                ${filme.status || "Não informado"}
              </span>

            </div>

          </div>


          ${
            filme.url
              ? `
                <a
                  href="${filme.url}"
                  target="_blank"
                  class="mal-button"
                >
                  Ver no MyAnimeList
                </a>
              `
              : ""
          }

        </div>

      </div>

    `;

  } catch (erro) {

    movieDetails.innerHTML = `

      <div class="modal-error">

        <h2>
          Erro ao carregar filme
        </h2>

        <p>
          Não foi possível carregar
          os detalhes desse filme.
        </p>

      </div>

    `;

  }

}


/**
 * Fecha o modal
 */
function fecharModal() {

  movieModal.classList.add("hidden");

}


/**
 * Eventos
 */
searchButton.addEventListener(
  "click",
  () => {

    const pesquisa =
      searchInput.value.trim();

    carregarFilmes(pesquisa);

  }
);


searchInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      const pesquisa =
        searchInput.value.trim();

      carregarFilmes(pesquisa);

    }

  }
);


closeModal.addEventListener(
  "click",
  fecharModal
);


modalOverlay.addEventListener(
  "click",
  fecharModal
);


tryAgain.addEventListener(
  "click",
  () => carregarFilmes()
);


/**
 * Inicialização
 */
carregarFilmes();