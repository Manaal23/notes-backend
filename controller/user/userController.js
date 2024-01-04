const AuthServices = require('../../services/AuthServices')

class userController{

    async signUp(req, res) {
        const response = await AuthServices.signUp(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    
    async login (req, res) {
        const response = await AuthServices.login(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }

}

module.exports = new userController()
