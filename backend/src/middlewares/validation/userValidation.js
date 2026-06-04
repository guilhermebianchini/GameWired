import { body, validationResult } from 'express-validator'
import userRepository from '../../repositories/userRepository.js'

export const registerValidation = [
    body("nome_usuario")
        .trim()
        .notEmpty()
        .withMessage("O nome de usuário é obrigatório!")
        .isLength({ min: 3, max: 30 })
        .withMessage("O campo deve ter no mínimo 3 caracteres e no máximo 30 caracteres!")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("O nome de usuário deve conter apenas letras, números e o caractere '_'.")
        .custom(async (value) => {
            const user = await userRepository.findByUsername(value)

            if (user) {
                throw new Error("Esse nome de usuário já está em uso!")
            }

            return true
        }),

    body("data_nascimento")
        .notEmpty()
        .withMessage("A data de nascimento é obrigatória!")
        .isDate()
        .withMessage("Informe uma data válida!")
        .custom((value) => {
            const birthDate = new Date(value)
            const today = new Date()

            const year = birthDate.getFullYear()

            today.setHours(0, 0, 0, 0)
            birthDate.setHours(0, 0, 0, 0)

            if (year < 1920) {
                throw new Error("Informe uma data válida!")
            }

            if (birthDate > today) {
                throw new Error("A data de nascimento não pode estar no futuro!")
            }

            return true
        }),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("O e-mail precisa ser válido!")
        .normalizeEmail()
        .custom(async (value) => {
            const email = await userRepository.findByEmail(value)

            if (email) {
                throw new Error("Esse email já está em uso!")
            }

            return true
        }),

    body("senha")
        .notEmpty()
        .withMessage("A senha é obrigatória!")
        .isLength({ min: 8 })
        .withMessage("A senha deve ter ao menos 8 caracteres!")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)
        .withMessage("Sua senha deve conter as menos 1 letra minúscula, 1 letra maiúscula, 1 número e 1 caractere especial (@,$ ou #)!"),

    body("confirmarSenha")
        .notEmpty()
        .withMessage("A confirmação de senha é obrigatória!")
        .custom((value, { req }) => {
            if (value !== req.body.senha) {
                throw new Error("As senhas não coincidem!")
            }

            return true
        })
]

export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("O e-mail é obrigatório!")
        .isEmail()
        .withMessage("O e-mail precisa ser válido!")
        .normalizeEmail(),

    body("senha")
        .trim()
        .notEmpty()
        .withMessage("A senha é obrigatória!")
]

export function validateUser(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next()
}