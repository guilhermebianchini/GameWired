const palavrasProibidas = [
    "porra", "caralho", "cu", "filho da puta", "vai se fuder", "viado", "vsf", "fdp", "vai tomar no cu", "vtnc", "tnc", "fuck", "shit"
]

function escapeRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasLinks(texto) {
    const regexLinks =
        /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|gg|io|br|dev|app|tv|xyz))/i

    return regexLinks.test(texto)
}

function hasProfanity(texto) {
    return palavrasProibidas.some((palavra) => {
        const regex = new RegExp(`\\b${escapeRegex(palavra)}\\b`, "i")
        return regex.test(texto)
    })
}

export const postModeration = (req, res, next) => {
    const titulo = req.body.titulo_postagem ?? ""
    const conteudo = req.body.conteudo_postagem ?? ""

    const textoNormalizado = `${titulo} ${conteudo}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()

    if (hasLinks(textoNormalizado)) {
        return res.status(400).json({
            ok: false,
            message: "Não é permitido publicar links na comunidade!"
        })
    }

    if (hasProfanity(textoNormalizado)) {
        return res.status(400).json({
            ok: false,
            message: "Sua publicação contém linguagem inadequada!"
        })
    }

    next()
}