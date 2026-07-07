import sanitizeHtml from 'sanitize-html'

export const sanitizePost = (req, res, next) => {
    if (req.body.titulo_postagem) {
        req.body.titulo_postagem = sanitizeHtml(
            req.body.titulo_postagem,
            {
                allowedTags: [],
                allowedAttributes: {}
            }
        )
    }

    if (req.body.conteudo_postagem) {
        req.body.conteudo_postagem = sanitizeHtml(req.body.conteudo_postagem, {
            allowedTags: [
                "li", "ol", "ul", "u", "p", "b", "br", "em", "i", "strong", "blockquote"
            ],
            allowedAttributes: {}
        })
    }

    next()
}