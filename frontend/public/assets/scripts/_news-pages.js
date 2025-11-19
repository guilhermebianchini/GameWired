const pages = document.querySelectorAll(".page")
const buttons = document.querySelectorAll(".page-btn")

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const pageNumber = btn.dataset.page

        // Esconde todas as páginas
        pages.forEach(page => page.classList.remove("active"))

        // Mostra a página escolhida
        document.querySelector(`.page[data-page="${pageNumber}"]`).classList.add("active")

        // Atualiza o botão ativo
        buttons.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
    })
})