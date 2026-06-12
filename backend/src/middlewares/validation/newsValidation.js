import { body, param, validationResult } from 'express-validator'
import sanitizeHtml from "sanitize-html"

const imageValidation = body("img_noticia")
    .custom((value, { req }) => {

        if (!req.file) {
            return true
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg"
        ]

        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error("Formato inválido! Use JPEG, PNG ou JPG.")
        }

        return true
    })

export const newsIDValidation = [
    param("news_id")
        .notEmpty()
        .withMessage("O ID é obrigatório!")
        .isInt({ min: 1 })
        .toInt()
        .withMessage("O ID deve ser um número inteiro e positivo!")
]

export const createNewsValidation = [
    body("titulo")
        .trim()
        .notEmpty()
        .withMessage("O título da notícia é obrigatório!")
        .isLength({ min: 25, max: 200 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 200 caracteres!"),

    body("data_publicacao")
        .notEmpty()
        .withMessage("A data da publicação é obrigatória!")
        .isDate()
        .withMessage("Informe uma data válida!"),

    body("subtitulo")
        .trim()
        .notEmpty()
        .withMessage("O subtítulo da notícia é obrigatório!")
        .isLength({ min: 25, max: 400 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 400 caracteres!"),

    imageValidation,

    body("conteudo")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo da notícia é obrigatório!")
        .custom((value) => {
            const textoPuro = sanitizeHtml(value, {
                allowedTags: [],
                allowedAttributes: {}
            }).trim()

            if (textoPuro.length < 200 || textoPuro.length > 6000) {
                throw new Error(
                    "O campo deve ter no mínimo 200 caracteres e no máximo 6000 caracteres!"
                )
            }

            return true
        }),

    body("fonte")
        .trim()
        .notEmpty()
        .withMessage("A fonte da notícia é obrigatória!")
        .isURL({
            protocols: ["http", "https"],
            require_protocol: true
        })
        .withMessage("Informe uma URL válida!")
]

export const updateNewsValidation = [
    param("news_id")
        .isInt({ min: 1 })
        .toInt()
        .withMessage("ID inválido!"),

    body("titulo")
        .trim()
        .notEmpty()
        .withMessage("O título da notícia é obrigatório!")
        .isLength({ min: 25, max: 200 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 200 caracteres!"),

    body("data_publicacao")
        .notEmpty()
        .withMessage("A data da publicação é obrigatória!")
        .isDate()
        .withMessage("Informe uma data válida!"),

    body("subtitulo")
        .trim()
        .notEmpty()
        .withMessage("O subtítulo da notícia é obrigatório!")
        .isLength({ min: 25, max: 400 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 400 caracteres!"),

    imageValidation,

    body("conteudo")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo da notícia é obrigatório!")
        .custom((value) => {
            const textoPuro = sanitizeHtml(value, {
                allowedTags: [],
                allowedAttributes: {}
            }).trim()

            if (textoPuro.length < 200 || textoPuro.length > 6000) {
                throw new Error(
                    "O campo deve ter no mínimo 200 caracteres e no máximo 6000 caracteres!"
                )
            }

            return true
        }),

    body("fonte")
        .trim()
        .notEmpty()
        .withMessage("A fonte da notícia é obrigatória!")
        .isURL({
            protocols: ["http", "https"],
            require_protocol: true
        })
        .withMessage("Informe uma URL válida!")
]

export const deleteNewsValidation = [
    param("news_id")
        .isInt({ min: 1 })
        .toInt()
        .withMessage("ID inválido!"),

    body("key")
        .equals("EXCLUIR")
        .withMessage("Confirmação inválida!")
]

export function validateNews(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: "Erro de validação!",
            errors: errors.array()
        })
    }

    next()
}