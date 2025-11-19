import userRepository from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'

const authUserController = {

    login: async (req, res)=>{
        if(!req.body.email || !req.body.senha){
            res.status(400).json({
                ok:false,
                message:'Corpo padrão ausente!'
            })

            return
        }

        const {email,senha} = req.body

        const user = await userRepository.readUser(email,senha)
    },

    crypt: (senha) => {
        const csenha = bcrypt.hashSync(senha,8)
        return csenha
    },

    compare: (senha,hash) => {
        const c = bcrypt.compareSync(senha,hash)
        return c
    }
}

export default authUserController