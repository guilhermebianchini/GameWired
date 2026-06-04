import { body, param, validationResult } from 'express-validator'
import postRepository from '../../repositories/postRepository.js'

const postValidation = body("post_id")
    .notEmpty()
    .withMessage("O post é obrigatório!")
    .isInt({ min: 1 })
    .withMessage("Post inválido!")
    .toInt()
    .custom(async (value) => {

        const post = await postRepository.readById(value)

        if (!post) {
            throw new Error("Post não encontrado!")
        }

        return true
    })

export const commentIDValidation = [
    param("comentario_id")
        .notEmpty()
        .withMessage("O ID é obrigatório!")
        .isInt({ min: 1 })
        .withMessage("O ID deve ser um número inteiro e positivo!")
        .toInt()
]

export const createCommentValidation = [
    body("comentario_conteudo")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo do comentário é obrigatório!")
        .isLength({ min: 5, max: 500 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 500 caracteres!"),

    postValidation
]

export const updateCommentValidation = [
    commentIDValidation,

    body("comentario_conteudo")
        .trim()
        .notEmpty()
        .withMessage("O conteúdo do comentário é obrigatório!")
        .isLength({ min: 5, max: 500 })
        .withMessage("O campo deve ter no mínimo 5 caracteres e no máximo 500 caracteres!"),

    postValidation
]

export const deleteCommentValidation = [
    commentIDValidation,

    body("key")
        .equals("EXCLUIR")
        .withMessage("Confirmação inválida!"),

    postValidation
]

export function validateComment(req, res, next) {
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