async function loadHTML(elementId, file) {
    const response = await fetch(file)
    const html = await response.text()
    document.getElementById(elementId).innerHTML = html

    if (elementId === "header") {
        const script = document.createElement("script")
        script.src = "/views/src/assets/scripts/_auth.js"
        document.body.appendChild(script)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadHTML('header', '/views/src/pages/global/header.html')
    loadHTML('footer', '/views/src/pages/global/footer.html')
})