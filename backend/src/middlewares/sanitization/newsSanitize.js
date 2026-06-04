import sanitizeHtml from 'sanitize-html'

export const sanitizeNews = (req, res, next) => {
    if (req.body.content) {
        req.body.content = sanitizeHtml(req.body.content, {
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

    next()
}