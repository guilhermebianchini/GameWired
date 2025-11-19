const editor = document.getElementById("editor");
const inputCapa = document.getElementById("capa");


document.getElementById("postForm").addEventListener("submit", publicar);

function execCmd(command, value = null) {
  document.execCommand(command, false, value);
  editor.focus();
}

function addLink() {
  const url = prompt("Digite a URL do link:");
  if (url && url.trim() !== "") {
    execCmd("createLink", url);
  }
}

function publicar(event) {
  event.preventDefault(); 
  const titulo = document.getElementById("titulo").value.trim();
  const data = document.getElementById("data").value;
  const resumo = document.getElementById("resumo")?.value?.trim?.() ?? "";
  const conteudo = editor.innerHTML.trim();

  if (!titulo || !conteudo) {
    alert("Preencha pelo menos o título e o conteúdo.");
    return;
  }

  const post = {
    id: Date.now(),
    titulo,
    data: data || new Date().toISOString().split("T")[0],
    resumo,
    conteudo
  };

  console.log("Post criado:", post);
  //alert("Notícia criada com sucesso!");

  event.target.reset();
  editor.innerHTML = ""; 
}


window.execCmd = execCmd;
window.addLink = addLink;