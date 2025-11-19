document.addEventListener("DOMContentLoaded", () => {
  const abrirModalBtn = document.getElementById("abrirModalBtn");
  const modal = document.getElementById("modal");
  const fecharModalBtn = document.getElementById("fecharModal");
  const form = document.getElementById("postForm");
  const postsContainer = document.getElementById("postsContainer");
  const categoriaSelect = document.getElementById("categoria");
  let editandoId = null;

  // ===== Modal =====
  abrirModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  fecharModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    editandoId = null;
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      form.reset();
      editandoId = null;
    }
  });

  // ====== Backend ======
  async function carregarCategorias() {
    const response = await fetch("/api/jogos");
    const data = await response.json();

    categoriaSelect.innerHTML = '<option value="">Selecione o jogo</option>';
    data.categorias.forEach((jogo) => {
      const option = document.createElement("option");
      option.value = jogo;
      option.textContent = jogo;
      categoriaSelect.appendChild(option);
    });
  }

  async function carregarPosts() {
    const response = await fetch("/api/posts");
    const posts = await response.json();

    postsContainer.innerHTML = "<h2>Publicações Recentes</h2>";

    posts.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");
      const dataFormatada = new Date(post.dataPublicacao).toLocaleString("pt-BR");

      postDiv.innerHTML = `
        <h3>${post.titulo}</h3>
        <small><strong>Jogo:</strong> ${post.categoria}</small><br>
        <small><strong>Publicado em:</strong> ${dataFormatada}</small>
        <p>${post.conteudo}</p>
        ${post.imagem ? `<img src="${post.imagem}" alt="Imagem do post">` : ""}
        <div class="botoes">
          <button onclick="editarPost(${post.id})">✏️ Editar</button>
          <button onclick="deletarPost(${post.id})">🗑️ Deletar</button>
        </div>
      `;
      postsContainer.appendChild(postDiv);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const conteudo = document.getElementById("conteudo").value;
    const imagemInput = document.getElementById("imagem");

    let imagemBase64 = "";
    if (imagemInput.files && imagemInput.files[0]) {
      imagemBase64 = await toBase64(imagemInput.files[0]);
    }

    const novoPost = { titulo, categoria, conteudo, imagem: imagemBase64 };

    if (editandoId) {
      await fetch(`/api/posts/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPost),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPost),
      });
    }

    modal.style.display = "none";
    form.reset();
    editandoId = null;
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

  // Editar e Deletar posts
  window.editarPost = async function (id) {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    const post = posts.find((p) => p.id === id);

    if (post) {
      document.getElementById("titulo").value = post.titulo;
      document.getElementById("categoria").value = post.categoria;
      document.getElementById("conteudo").value = post.conteudo;
      editandoId = id;
      modal.style.display = "block";
    }
  };

  window.deletarPost = async function (id) {
    if (confirm("Tem certeza que deseja excluir este post?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      carregarPosts();
    }
  };

  // Inicialização
  carregarCategorias();
  carregarPosts();
});