const { Router } = require("express");
const { createComment, getComment } = require("../controllers/commentController");
const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

router.post('/create', checkUser, createComment);
router.get('/', getComment);


module.exports = {
    commentRouter: router
}