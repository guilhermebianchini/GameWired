import { body, validationResult } from "express-validator"

const imageValidation = body("foto_perfil")
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
            throw new Error(
                "Formato inválido! Use JPEG, PNG ou JPG."
            )
        }

        return true
    })

export const updateProfileValidation = [
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("A bio deve possuir no máximo 500 caracteres!"),

    imageValidation
]

export function validateProfile(req, res, next) {
    
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