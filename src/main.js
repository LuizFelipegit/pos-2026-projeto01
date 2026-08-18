import "./style.css";

import {
    buscarFilmesPopulares,
    pesquisarFilmes,
    buscarDetalhesFilme,
    buscarTrailer
} from "./api.js";


const listaFilmes =
    document.querySelector("#listaFilmes");

const loading =
    document.querySelector("#loading");

const erro =
    document.querySelector("#erro");

const mensagemErro =
    document.querySelector("#mensagemErro");

const vazio =
    document.querySelector("#vazio");

const campoPesquisa =
    document.querySelector("#pesquisa");

const botaoPesquisa =
    document.querySelector("#botaoPesquisa");

const modal =
    document.querySelector("#modal");

const conteudoModal =
    document.querySelector("#conteudoModal");

const fecharModal =
    document.querySelector("#fecharModal");


const URL_IMAGEM =
    "https://image.tmdb.org/t/p/w500";

const URL_BACKDROP =
    "https://image.tmdb.org/t/p/original";


function mostrarLoading() {

    loading.classList.remove("hidden");

    erro.classList.add("hidden");

    vazio.classList.add("hidden");

    listaFilmes.innerHTML = "";
}


function esconderLoading() {

    loading.classList.add("hidden");
}


function mostrarErro(mensagem) {

    loading.classList.add("hidden");

    erro.classList.remove("hidden");

    mensagemErro.textContent = mensagem;

    listaFilmes.innerHTML = "";
}


function criarCard(filme) {

    const card =
        document.createElement("article");

    card.classList.add("filme-card");


    const poster =
        filme.poster_path
            ? `${URL_IMAGEM}${filme.poster_path}`
            : "https://via.placeholder.com/500x750?text=Sem+Poster";


    const nota =
        filme.vote_average
            ? filme.vote_average.toFixed(1)
            : "N/A";


    const ano =
        filme.release_date
            ? filme.release_date.substring(0, 4)
            : "N/A";


    card.innerHTML = `

        <div class="poster">

            <img
                src="${poster}"
                alt="Poster do filme ${filme.title}"
                loading="lazy"
            >

            <span class="nota">
                ⭐ ${nota}
            </span>

        </div>


        <div class="filme-info">

            <span class="ano">
                ${ano}
            </span>

            <h3 title="${filme.title}">
                ${filme.title}
            </h3>

            <button
                class="botao-detalhes"
                data-id="${filme.id}"
            >
                Ver detalhes
            </button>

        </div>

    `;


    const botao =
        card.querySelector(".botao-detalhes");


    botao.addEventListener(
        "click",
        () => abrirDetalhes(filme.id)
    );


    return card;
}


function mostrarFilmes(filmes) {

    listaFilmes.innerHTML = "";

    vazio.classList.add("hidden");


    if (!filmes || filmes.length === 0) {

        vazio.classList.remove("hidden");

        return;
    }


    filmes.forEach(filme => {

        const card =
            criarCard(filme);

        listaFilmes.appendChild(card);

    });
}


async function carregarFilmes() {

    mostrarLoading();

    try {

        console.log(
            "Buscando filmes na TMDB..."
        );


        const filmes =
            await buscarFilmesPopulares();


        console.log(
            "Filmes encontrados:",
            filmes
        );


        mostrarFilmes(filmes);

        esconderLoading();

    } catch (error) {

        console.error(error);

        mostrarErro(
            "Não foi possível carregar os filmes. Confira o token da TMDB no arquivo .env."
        );
    }
}


async function pesquisar() {

    const nome =
        campoPesquisa.value.trim();


    if (!nome) {

        carregarFilmes();

        return;
    }


    mostrarLoading();


    try {

        const filmes =
            await pesquisarFilmes(nome);


        mostrarFilmes(filmes);

        esconderLoading();


        document
            .querySelector("#filmes")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(error);

        mostrarErro(
            "Não foi possível realizar a pesquisa."
        );
    }
}


botaoPesquisa.addEventListener(
    "click",
    pesquisar
);


campoPesquisa.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            pesquisar();
        }

    }
);


async function abrirDetalhes(id) {

    modal.classList.remove("hidden");


    conteudoModal.innerHTML = `

        <div class="carregando-detalhes">

            <div class="spinner"></div>

            <p>
                Carregando informações...
            </p>

        </div>

    `;


    try {

        const filme =
            await buscarDetalhesFilme(id);


        const poster =
            filme.poster_path
                ? `${URL_IMAGEM}${filme.poster_path}`
                : "https://via.placeholder.com/500x750?text=Sem+Poster";


        const backdrop =
            filme.backdrop_path
                ? `${URL_BACKDROP}${filme.backdrop_path}`
                : poster;


        const generos =
            filme.genres
                ?.map(genero => genero.name)
                .join(", ")
                || "Não informado";


        const duracao =
            filme.runtime
                ? `${filme.runtime} minutos`
                : "Não informado";


        const nota =
            filme.vote_average
                ? filme.vote_average.toFixed(1)
                : "N/A";


        conteudoModal.innerHTML = `

            <div
                class="detalhes-banner"
                style="
                    background-image:
                    linear-gradient(
                        rgba(8, 11, 18, .35),
                        #111620 90%
                    ),
                    url('${backdrop}');
                "
            >

                <div class="detalhes-conteudo">

                    <img
                        class="detalhes-poster"
                        src="${poster}"
                        alt="Poster de ${filme.title}"
                    >


                    <div class="detalhes-texto">

                        <span class="categoria">
                            FILME
                        </span>

                        <h2>
                            ${filme.title}
                        </h2>

                        <p class="titulo-original">
                            ${filme.original_title}
                        </p>


                        <div class="informacoes">

                            <span>
                                ⭐ ${nota}
                            </span>

                            <span>
                                📅 ${filme.release_date || "N/A"}
                            </span>

                            <span>
                                ⏱️ ${duracao}
                            </span>

                        </div>


                        <p class="sinopse">

                            ${
                                filme.overview ||
                                "Sinopse não disponível."
                            }

                        </p>


                        <div class="dados">

                            <div>

                                <strong>
                                    Gênero
                                </strong>

                                <span>
                                    ${generos}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Popularidade
                                </strong>

                                <span>
                                    ${filme.popularity.toFixed(0)}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Votos
                                </strong>

                                <span>
                                    ${filme.vote_count}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Idioma
                                </strong>

                                <span>
                                    ${filme.original_language.toUpperCase()}
                                </span>

                            </div>

                        </div>


                        <div id="trailerArea"></div>

                    </div>

                </div>

            </div>

        `;


        carregarTrailer(filme.id);


    } catch (error) {

        console.error(error);

        conteudoModal.innerHTML = `

            <div class="erro">

                <h3>
                    Erro
                </h3>

                <p>
                    Não foi possível carregar os detalhes.
                </p>

            </div>

        `;
    }
}


async function carregarTrailer(id) {

    try {

        const videos =
            await buscarTrailer(id);


        const trailer =
            videos.find(
                video =>
                    video.site === "YouTube" &&
                    video.type === "Trailer"
            );


        if (!trailer) {
            return;
        }


        const area =
            document.querySelector("#trailerArea");


        if (!area) {
            return;
        }


        area.innerHTML = `

            <a
                class="botao-trailer"
                href="https://www.youtube.com/watch?v=${trailer.key}"
                target="_blank"
                rel="noopener noreferrer"
            >
                ▶ Assistir trailer
            </a>

        `;


    } catch (error) {

        console.error(
            "Erro ao buscar trailer:",
            error
        );
    }
}


fecharModal.addEventListener(
    "click",
    () => {

        modal.classList.add("hidden");

        conteudoModal.innerHTML = "";

    }
);


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            modal.classList.add("hidden");

            conteudoModal.innerHTML = "";
        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !modal.classList.contains("hidden")
        ) {

            modal.classList.add("hidden");

            conteudoModal.innerHTML = "";
        }

    }
);


carregarFilmes();