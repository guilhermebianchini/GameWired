const form = document.getElementById("postForm");
const postsContainer = document.getElementById("postsContainer");
const categoriaSelect = document.getElementById("categoria");

// Carregar categorias do backend
async function carregarCategorias() {
  const response = await fetch("/api/jogos");
  const data = await response.json();

  categoriaSelect.innerHTML = '<option value="">Selecione o jogo</option>';
  data.categorias.forEach(jogo => {
    const option = document.createElement("option");
    option.value = jogo;
    option.textContent = jogo;
    categoriaSelect.appendChild(option);
  });
}

// Carregar posts existentes do backend
async function carregarPosts() {
  const response = await fetch("/api/posts");
  const posts = await response.json();

  postsContainer.innerHTML = "<h2>Publicações</h2>";

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const dataFormatada = new Date(post.dataPublicacao).toLocaleString("pt-BR");

    postDiv.innerHTML = `
      <h3>${post.titulo}</h3>
      <small><strong>Jogo:</strong> ${post.categoria}</small><br>
      <small><strong>Publicado em:</strong> ${dataFormatada}</small>
      <p>${post.conteudo}</p>
      ${post.imagem ? `<img src="${post.imagem}" alt="Imagem do post">` : ""}
    `;
    postsContainer.appendChild(postDiv);
  });
}

// Enviar novo post ao backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const categoria = document.getElementById("categoria").value;
  const conteudo = document.getElementById("conteudo").value;
  const imagemInput = document.getElementById("imagem");

  let imagemBase64 = "";
  if (imagemInput.files && imagemInput.files[0]) {
    const file = imagemInput.files[0];
    imagemBase64 = await toBase64(file);
  }

  const novoPost = { titulo, categoria, conteudo, imagem: imagemBase64 };

  await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoPost),
  });

  form.reset();
  carregarPosts();
});

// Converter imagem em base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarCategorias();
  carregarPosts();
});