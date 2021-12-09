const { Router } = require("express");

const { createUser, getMe, updateUser } = require("../controllers/userController");

const { login } = require('../controllers/authController')

const { ifHasUser, checkUser } = require('../middlewares/authMiddleware')

const router = Router();

router.post('/create', ifHasUser , createUser)
router.post('/login', ifHasUser, login)
router.get('/', checkUser, getMe)
router.put('/', checkUser, updateUser)

module.exports = {
    userRouter: router
}