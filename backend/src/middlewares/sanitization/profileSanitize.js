import sanitizeHtml from 'sanitize-html'

export const sanitizeProfile = (req, res, next) => {
    if (req.body.bio) {
        req.body.bio = sanitizeHtml(req.body.bio, {
            allowedTags: [],
            allowedAttributes: {}
        })
    }

    next()
}