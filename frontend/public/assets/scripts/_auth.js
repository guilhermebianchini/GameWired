async function applyauth() {
    const token = localStorage.getItem("token")

    const registerDesktop = document.getElementById("registerLinkDesktop")
    const profileDesktop = document.getElementById("profileLinkDesktop")
    const logoutDesktop = document.getElementById("logoutBtnDesktop")

    const registerMobile = document.getElementById("registerLinkMobile")
    const profileMobile = document.getElementById("profileLinkMobile")
    const logoutMobile = document.getElementById("logoutBtnMobile")

    const dashboardBtn = document.getElementById("dashboardBtn")

    if (!registerDesktop) return

    if (!token) {
        registerDesktop.style.display = "inline-block"
        registerMobile.style.display = "inline-block"

        profileDesktop.style.display = "none"
        profileMobile.style.display = "none"

        logoutDesktop.style.display = "none"
        logoutMobile.style.display = "none"

        if (dashboardBtn) {
            dashboardBtn.style.display = "none"
        }

        return
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            logout()
            return
        }

        const user = await response.json()

        registerDesktop.style.display = "none"
        registerMobile.style.display = "none"

        profileDesktop.style.display = "inline-block"
        profileMobile.style.display = "inline-block"

        profileDesktop.href = `/perfil`
        profileMobile.href = `/perfil`

        logoutDesktop.style.display = "inline-block"
        logoutMobile.style.display = "inline-block"

        if (dashboardBtn) {

            if (user.user_type === "admin" || user.user_type === "editor") {
                dashboardBtn.style.display = "inline-block"
            } else {
                dashboardBtn.style.display = "none"
            }
        }

    } catch (error) {

        console.error("Erro ao autenticar usuário:", error)
        logout()
    }

    logoutDesktop.addEventListener("click", logout)
    logoutMobile.addEventListener("click", logout)

}

function logout() {
    localStorage.removeItem("token")
    window.location.reload()
}

applyauth()