const { Router } = require("express");
const { createCard, getCard, deleteCard, updateCard } = require("../controllers/cardController");
// const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

router.post('/create', createCard);
router.get('/', getCard);
router.delete('/:id', deleteCard);
router.put('/:id', updateCard);


module.exports = {
    cardRouter: router
}