const { Router } = require("express");

const { createDiscount, deleteDicount, updateDicount } = require("../controllers/discountController");

const router = Router();

router.post('/create', createDiscount);
// router.get('/', getMe);
router.delete('/:id', deleteDicount);
router.put('/:id', updateDicount);

module.exports = {
    discountRouter: router
}