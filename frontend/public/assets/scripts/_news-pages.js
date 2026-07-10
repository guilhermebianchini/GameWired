const pages = document.querySelectorAll(".page")
const buttons = document.querySelectorAll(".page-btn")

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const pageNumber = btn.dataset.page

        // ESCONDE TODAS AS PÁGINAS

        pages.forEach(page => page.classList.remove("active"))

        // MOSTRA A PÁGINA ESCOLHIDA

        document.querySelector(`.page[data-page="${pageNumber}"]`).classList.add("active")

        // ATUALIZA O BOTÃO ATIVO

        buttons.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
    })
})