const { Router } = require("express");

const { createDiscount, deleteDicount, updateDicount, getDiscount } = require("../controllers/discountController");

const router = Router();

router.post('/create', createDiscount);
router.get('/', getDiscount);
router.delete('/:id', deleteDicount);
router.put('/:id', updateDicount);

module.exports = {
    discountRouter: router
}