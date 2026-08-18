const API_URL = "https://api.themoviedb.org/3";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;


const headers = {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`
};


// ========================================
// FILMES POPULARES
// ========================================

export async function buscarFilmesPopulares() {

    const resposta = await fetch(
        `${API_URL}/movie/popular?language=pt-BR&page=1`,
        {
            method: "GET",
            headers: headers
        }
    );

    if (!resposta.ok) {

        throw new Error(
            `Erro na API: ${resposta.status}`
        );
    }

    const dados = await resposta.json();

    return dados.results;
}


// ========================================
// PESQUISAR FILMES
// ========================================

export async function pesquisarFilmes(nome) {

    const resposta = await fetch(
        `${API_URL}/search/movie?query=${encodeURIComponent(nome)}&language=pt-BR&page=1&include_adult=false`,
        {
            method: "GET",
            headers: headers
        }
    );

    if (!resposta.ok) {

        throw new Error(
            `Erro na pesquisa: ${resposta.status}`
        );
    }

    const dados = await resposta.json();

    return dados.results;
}


// ========================================
// DETALHES DO FILME
// ========================================

export async function buscarDetalhesFilme(id) {

    const resposta = await fetch(
        `${API_URL}/movie/${id}?language=pt-BR`,
        {
            method: "GET",
            headers: headers
        }
    );

    if (!resposta.ok) {

        throw new Error(
            `Erro nos detalhes: ${resposta.status}`
        );
    }

    return await resposta.json();
}


// ========================================
// TRAILER
// ========================================

export async function buscarTrailer(id) {

    const resposta = await fetch(
        `${API_URL}/movie/${id}/videos?language=pt-BR`,
        {
            method: "GET",
            headers: headers
        }
    );

    if (!resposta.ok) {
        return [];
    }

    const dados = await resposta.json();

    return dados.results;
}
