async function loadHTML(elementId, file) {
    const response = await fetch(file)
    const html = await response.text()
    document.getElementById(elementId).innerHTML = html

    if (elementId === "header") {
        const script = document.createElement("script")
        script.src = "/frontend/public/assets/scripts/_auth.js"
        document.body.appendChild(script)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadHTML('header', '/frontend/views/components/global/header.html')
    loadHTML('footer', '/frontend/views/components/global/footer.html')
})