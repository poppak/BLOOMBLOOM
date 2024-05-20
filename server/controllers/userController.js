const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, name, email, phone, roleId) => {
    return jwt.sign(
        {id, name, email, phone, roleId},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {name, email, phone, password, roleId} = req.body
        if(!name || !email || !phone || !password) {
           return next(ApiError.badRequest('Некорректные данные'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({name, email, roleId, phone, password: hashPassword})
        const token = generateJwt(user.id, user.name, user.email, user.phone, user.roleId)
        Basket.create({
            userId: user.id,
        })
        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.name, user.email, user.phone, user.roleId)
        return res.json({token})
    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.name, req.user.email, req.user.phone, req.user.roleId)
        return res.json({token})
    }
    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }
}

module.exports = new UserController()