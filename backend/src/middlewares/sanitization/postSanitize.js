import sanitizeHtml from 'sanitize-html'

export const sanitizePost = (req, res, next) => {
    if (req.body.content) {
        req.body.content = sanitizeHtml(req.body.content, {
            allowedTags: [
                "li", "ol", "ul", "u", "p", "a", "b", "br", "em", "i", "strong", "h2", "h3", "h4", "blockquote"
            ]
        })
    }

    next()
}