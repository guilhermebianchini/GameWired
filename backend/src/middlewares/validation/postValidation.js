import { body, param, query, validationResult } from 'express-validator'
import gameRepository from '../../repositories/gameRepository.js'

const gameValidation = body("games_id")
    .notEmpty()
    .withMessage("A categoria é obrigatória!")
    .isInt({ min: 1 })
    .withMessage("Categoria inválida!")
    .toInt()
    .custom(async (value) => {
        const game = await gameRepository.readById(value)

        if (!game) {
            throw new Error("Jogo não encontrado!")
        }

        return true
    })

const imageValidation = body("foto_postagem")
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

export const cursorValidation = [
    query("cursor")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Cursor inválido!")
        .toInt(),

    query("games_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Jogo inválido!")
        .toInt()
]

export const postIDValidation = [
    param("post_id")
        .notEmpty()
        .withMessage("O ID é obrigatório!")
        .isInt({ min: 1 })
        .withMessage("O ID deve ser um número inteiro e positivo!")
        .toInt()
]

export const createPostValidation = [
    body("titulo_postagem")
        .trim()
        .notEmpty()
        .withMessage("O título do post é obrigatório!")
        .isLength({ min: 5, max: 200 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 200 caracteres!"),

    body("conteudo_postagem")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo é obrigatório!")
        .isLength({ min: 5, max: 1500 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 1500 caracteres!"),

    gameValidation,

    imageValidation
]

export const updatePostValidation = [
    param("post_id")
        .isInt({ min: 1 })
        .withMessage("ID inválido!")
        .toInt(),

    body("titulo_postagem")
        .trim()
        .notEmpty()
        .withMessage("O título do post é obrigatório!")
        .isLength({ min: 5, max: 200 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 200 caracteres!"),

    body("conteudo_postagem")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo é obrigatório!")
        .isLength({ min: 5, max: 1500 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 1500 caracteres!"),

    gameValidation,

    imageValidation
]

export const deletePostValidation = [
    param("post_id")
        .isInt({ min: 1 })
        .withMessage("ID inválido!")
        .toInt(),

    body("key")
        .equals("EXCLUIR")
        .withMessage("Confirmação inválida!")
]

export function validatePost(req, res, next) {
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