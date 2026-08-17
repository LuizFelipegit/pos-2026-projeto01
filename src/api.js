const API_URL = "https://api.jikan.moe/v4";


export async function buscarFilmes(pesquisa = "") {

  let url;

  if (pesquisa.trim()) {

    url =
      `${API_URL}/anime?q=${encodeURIComponent(pesquisa)}` +
      `&type=movie&sfw=true&limit=24`;

  } else {

    url =
      `${API_URL}/top/anime?type=movie&filter=bypopularity&limit=24`;

  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar filmes.");
  }

  const data = await response.json();

  return data.data || [];
}



export async function buscarDetalhesFilme(id) {

  const response =
    await fetch(`${API_URL}/anime/${id}/full`);

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes do filme.");
  }

  const data = await response.json();

  return data.data;
}