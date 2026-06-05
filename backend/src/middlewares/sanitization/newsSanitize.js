import sanitizeHtml from 'sanitize-html'

export const sanitizeNews = (req, res, next) => {
    if (req.body.titulo) {
        req.body.titulo = sanitizeHtml(
            req.body.titulo,
            {
                allowedTags: [],
                allowedAttributes: {}
            }
        )
    }

    if (req.body.subtitulo) {
        req.body.subtitulo = sanitizeHtml(
            req.body.subtitulo,
            {
                allowedTags: [],
                allowedAttributes: {}
            }
        )
    }

    if (req.body.conteudo) {
        req.body.conteudo = sanitizeHtml(req.body.conteudo, {
            allowedTags: [
                "li", "ol", "ul", "u", "p", "a", "b", "br", "em", "i", "strong", "h2", "h3", "h4", "blockquote", "iframe"
            ],

            allowedAttributes: {
                a: ["href", "target", "rel"],
                iframe: [
                    "src", "width", "height", "allow", "allowfullscreen", "loading"
                ]
            },

            allowedSchemes: [
                'https', 'http', 'mailto'
            ]
            ,

            allowedIframeHostnames: [
                'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'
            ]
        })
    }

    if (req.body.fonte) {
        req.body.fonte = req.body.fonte.trim()
    }

    next()
}