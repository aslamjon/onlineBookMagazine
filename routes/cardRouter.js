const { Router } = require("express");
const { createCard, getCard } = require("../controllers/cardController");
// const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

router.post('/create', createCard);
router.get('/', getCard);


module.exports = {
    cardRouter: router
}