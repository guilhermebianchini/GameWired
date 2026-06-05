import sanitizeHtml from 'sanitize-html'

export const sanitizeComment = (req, res, next) => {
    if (req.body.comentario_conteudo) {
        req.body.comentario_conteudo = sanitizeHtml(req.body.comentario_conteudo, {
            allowedTags: [],
            allowedAttributes: {}
        })
    }

    next()
}