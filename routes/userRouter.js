const { Router } = require("express");

const { createUser, getMe } = require("../controllers/userController");

const { login } = require('../controllers/authController')

const { ifHasUser, checkUser } = require('../middlewares/authMiddleware')

const router = Router();

router.post('/create', checkUser , createUser)
router.post('/login', ifHasUser, login)
router.get('/', checkUser, getMe)

module.exports = {
    userRouter: router
}