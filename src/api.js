const API_URL = "https://jsonplaceholder.typicode.com";

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json();
}

export function getUsers() {
  return request("/users");
}

export function getPostsByUser(userId) {
  return request(`/posts?userId=${userId}`);
}