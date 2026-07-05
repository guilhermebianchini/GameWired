import { body, param, validationResult } from 'express-validator'

const imageValidation = body("game_img")
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

const gameFieldsValidation = [
    body("nome")
        .trim()
        .notEmpty()
        .withMessage("O nome do jogo é obrigatório!")
        .isLength({ max: 150 })
        .withMessage("O campo deve ter no máximo 150 caracteres!"),

    body("descricao")
        .trim()
        .notEmpty()
        .withMessage("A descrição do jogo é obrigatória!")
        .isLength({ min: 25, max: 1000 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 1000 caracteres!"),

    body("genero")
        .trim()
        .notEmpty()
        .withMessage("O(s) gênero(s) do jogo é obrigatório!")
        .isLength({ max: 150 })
        .withMessage("O campo deve ter no máximo 150 caracteres!"),

    body("desenvolvedora")
        .trim()
        .notEmpty()
        .withMessage("A desenvolvedora do jogo é obrigatória!")
        .isLength({ max: 100 })
        .withMessage("O campo deve ter no máximo 100 caracteres!"),

    body("tipo")
        .trim()
        .notEmpty()
        .withMessage("O tipo do jogo é obrigatório!")
        .isLength({ max: 100 })
        .withMessage("O campo deve ter no máximo 100 caracteres!"),

    body("download")
        .trim()
        .notEmpty()
        .withMessage("O link ou plataforma de download é obrigatório!")
        .isLength({ max: 150 })
        .withMessage("O campo deve ter no máximo 150 caracteres!"),

    body("requisitos")
        .trim()
        .isLength({ min: 25, max: 1000 })
        .withMessage("O campo deve ter no mínimo 25 caracteres e no máximo 1000 caracteres!"),

    imageValidation,

    body("publicadora")
        .trim()
        .notEmpty()
        .withMessage("A publicadora do jogo é obrigatória!")
        .isLength({ max: 100 })
        .withMessage("O campo deve ter no máximo 100 caracteres!"),

    body("classificacao")
        .trim()
        .notEmpty()
        .withMessage("A classificação indicativa do jogo é obrigatória!")
        .isLength({ max: 30 })
        .withMessage("O campo deve ter no máximo 30 caracteres!"),

    body("plataformas")
        .custom((value) => {
            const plataformas = Array.isArray(value) ? value : [value]

            if (plataformas.length === 0) {
                throw new Error("É preciso selecionar ao menos uma plataforma!")
            }

            for (const plataforma of plataformas) {
                const id = Number(plataforma)

                if (!Number.isInteger(id) || id < 1 || id > 3) {
                    throw new Error("Plataforma inválida!")
                }
            }

            return true
        })
]

export const gameIDValidation = [
    param("games_id")
        .notEmpty()
        .withMessage("O ID é obrigatório!")
        .isInt({ min: 1 })
        .withMessage("O ID deve ser um número inteiro e positivo!")
]

export const platformValidation = [
    param("platform_id")
        .notEmpty()
        .withMessage("O ID da plataforma é obrigatório!")
        .isInt({ min: 1, max: 3 })
        .withMessage("O ID da plataforma deve ser um número entre 1 e 3!")
]

export const insertGameValidation = [
    ...gameFieldsValidation
]

export const updateGameValidation = [
    param("games_id")
        .isInt({ min: 1 })
        .toInt()
        .withMessage("ID inválido!"),

    ...gameFieldsValidation
]

export const deleteGameValidation = [
    param("games_id")
        .isInt({ min: 1 })
        .toInt()
        .withMessage("ID inválido!"),

    body("key")
        .equals("EXCLUIR")
        .withMessage("Confirmação inválida!")
]

export function validateGame(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()
}