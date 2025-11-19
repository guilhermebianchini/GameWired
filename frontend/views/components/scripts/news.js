const filtro = document.getElementById("filtro");
const listaNoticias = document.getElementById("listaNoticias");

let noticias = Array.from(listaNoticias.querySelectorAll(".card-news"));

function ordenarNoticias() {
  let tipo = filtro.value;
  let noticiasOrdenadas = [...noticias];

  if (tipo === "a-z") {
    noticiasOrdenadas.sort((a, b) => {
      const tituloA = a.querySelector("h4").innerText.toLowerCase();
      const tituloB = b.querySelector("h4").innerText.toLowerCase();
      return tituloA.localeCompare(tituloB);
    });
  }
  if (tipo === "z-a") {
    noticiasOrdenadas.sort((a, b) => {
      const tituloA = a.querySelector("h4").innerText.toLowerCase();
      const tituloB = b.querySelector("h4").innerText.toLowerCase();
      return tituloB.localeCompare(tituloA);
    });
  }

  listaNoticias.innerHTML = "";
  noticiasOrdenadas.forEach(noticia => listaNoticias.appendChild(noticia));
}

filtro.addEventListener("change", ordenarNoticias);

const verMaisBtn = document.getElementById("verMais");
let noticiasVisiveis = 3;

function renderizarComLimite(lista) {
  listaNoticias.innerHTML = "";
  lista.slice(0, noticiasVisiveis).forEach(noticia => {
    listaNoticias.appendChild(noticia);
  });

  if (noticiasVisiveis >= lista.length) {
    verMaisBtn.style.display = "none";
  } else {
    verMaisBtn.style.display = "block";
  }
}

renderizarComLimite(noticias);

filtro.addEventListener("change", () => {
  ordenarNoticias(); 


  noticias = Array.from(listaNoticias.querySelectorAll(".card-news"));

  noticiasVisiveis = 3; 
  renderizarComLimite(noticias);
});
verMaisBtn.addEventListener("click", () => {
  noticiasVisiveis += 3;
  renderizarComLimite(noticias);
});
// apagar data