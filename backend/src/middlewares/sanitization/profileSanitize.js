import sanitizeHtml from 'sanitize-html'

export const sanitizeProfile = (req, res, next) => {
    if (req.body.content) {
        req.body.content = sanitizeHtml(req.body.content, {
            allowedTags: [ ]
        })
    }

    next()
}