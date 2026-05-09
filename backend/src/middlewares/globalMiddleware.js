const globalMiddleware = {
    getIP(req,res,next){
        const ip = req.ip 

        next()
    },

    cors(req,res,next){
        res.setHeader('Access-Control-Allow-Origin','*')
        next()
    }
}

export default globalMiddleware