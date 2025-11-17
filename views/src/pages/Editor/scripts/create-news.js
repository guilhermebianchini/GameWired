/*const editor = document.getElementById("editor");
const tituloInput = document.getElementById("titulo");
const dataInput = document.getElementById("data");
const form = document.getElementById("formPost");

document.getElementById("btnBold").addEventListener("click", () => {
  document.execCommand("bold");
});

document.getElementById("btnItalic").addEventListener("click", () => {
  document.execCommand("italic");
});

document.getElementById("btnUnderline").addEventListener("click", () => {
  document.execCommand("underline");
});

document.getElementById("btnLink").addEventListener("click", () => {
  const url = prompt("Digite a URL do link:");
  if (url) document.execCommand("createLink", false, url);
});

document.getElementById("btnImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = () => {
    document.execCommand("insertImage", false, reader.result);
  };
  reader.readAsDataURL(file);
});


function salvarRascunho() {
  localStorage.setItem("post_titulo", tituloInput.value);
  localStorage.setItem("post_data", dataInput.value);
  localStorage.setItem("post_conteudo", editor.innerHTML);
}

tituloInput.addEventListener("input", salvarRascunho);
dataInput.addEventListener("input", salvarRascunho);
editor.addEventListener("input", salvarRascunho);


document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("post_titulo")) {
    tituloInput.value = localStorage.getItem("post_titulo");
  }
  if (localStorage.getItem("post_data")) {
    dataInput.value = localStorage.getItem("post_data");
  }
  if (localStorage.getItem("post_conteudo")) {
    editor.innerHTML = localStorage.getItem("post_conteudo");
  }
});


async function enviarParaAPI(dadosPost) {
  try {
    const resposta = await fetch("https://sua-api.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dadosPost)
    });

    //if (!resposta.ok) {
      //alert("Ocorreu um erro ao enviar o post!");
      //return;
    //}

    //alert("Post enviado com sucesso!");

    localStorage.removeItem("post_titulo");
    localStorage.removeItem("post_data");
    localStorage.removeItem("post_conteudo");

    form.reset();
    editor.innerHTML = "";
    
  } catch (erro) {
    console.error("Erro ao enviar:", erro);
    alert("Erro ao conectar com backend.");
  }
}


form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  const dadosPost = {
    titulo: tituloInput.value,
    data: dataInput.value,
    conteudo: editor.innerHTML
  };

  enviarParaAPI(dadosPost);
});*/