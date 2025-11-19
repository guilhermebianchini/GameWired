function applyauth() {
    const userId = localStorage.getItem("userId")

    const registerDesktop = document.getElementById("registerLinkDesktop")
    const profileDesktop = document.getElementById("profileLinkDesktop")
    const logoutDesktop = document.getElementById("logoutBtnDesktop")

    const registerMobile = document.getElementById("registerLinkMobile")
    const profileMobile = document.getElementById("profileLinkMobile")
    const logoutMobile = document.getElementById("logoutBtnMobile")

    if (!registerDesktop) return;

    if (userId) {

        registerDesktop.style.display = "none"
        registerMobile.style.display = "none"

        profileDesktop.style.display = "inline-block"
        profileMobile.style.display = "inline-block"

        profileDesktop.href = `/frontend/views/pages/profile.html?id=${userId}`
        profileMobile.href = `/frontend/views/pages/profile.html?id=${userId}`

        logoutDesktop.style.display = "inline-block"
        logoutMobile.style.display = "inline-block"

    } else {

        registerDesktop.style.display = "inline-block"
        registerMobile.style.display = "inline-block"

        profileDesktop.style.display = "none"
        profileMobile.style.display = "none"

        logoutDesktop.style.display = "none"
        logoutMobile.style.display = "none"

    }

    logoutDesktop.addEventListener("click", logout)
    logoutMobile.addEventListener("click", logout)

}
function logout() {
    localStorage.removeItem("userId")
    window.location.reload()
}

applyauth()