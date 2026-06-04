import { param, validationResult } from 'express-validator'
import gameRepository from '../../repositories/gameRepository.js'

export const gameIDValidation = [
    param('id')
        .notEmpty()
        .withMessage('O ID é obrigatório!')
        .isInt({ min: 1 })
        .withMessage('O ID deve ser um número inteiro e positivo!')
]

export const platformValidation = [
    param('platform_id')
        .notEmpty()
        .withMessage('O ID da plataforma é obrigatório!')
        .isInt({ min: 1, max: 3 })
        .withMessage('O ID da plataforma deve ser um número entre 1 e 3!')
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