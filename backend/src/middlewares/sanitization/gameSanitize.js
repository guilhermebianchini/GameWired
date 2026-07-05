import sanitizeHtml from "sanitize-html"

export const sanitizeGame = (req, res, next) => {

    const textFields = [
        "nome",
        "genero",
        "desenvolvedora",
        "publicadora",
        "tipo",
        "classificacao",
        "download"
    ]

    textFields.forEach(field => {
        if (req.body[field]) {
            req.body[field] = sanitizeHtml(req.body[field], {
                allowedTags: [],
                allowedAttributes: {}
            }).trim()
        }
    })

    if (req.body.descricao) {
        req.body.descricao = sanitizeHtml(req.body.descricao, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim()
    }

    if (req.body.requisitos) {
        req.body.requisitos = sanitizeHtml(req.body.requisitos, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim()
    }

    next()
}