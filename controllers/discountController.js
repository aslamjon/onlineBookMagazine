const { DiscountModel } = require('./../models/discountModel');
const { BookModel } = require("../models/bookModel");
const { formatDate, logger } = require("../utiles");

async function createDiscount(req, res) {
    try {
        const { productId, discount_percent, active } = req.body;
        const productExists = await BookModel.findById(productId);
        if (!discount_percent || !active) res.status(400).send({ message: "Bed request" });
        else if (typeof discount_percent !== 'number') res.status(400).send({ message: "Bed request. Please send the type of discount_percent as a number" });
        else if (!productExists) res.status(404).send({ message: "Product not found" });
        else if (productExists.discountId) res.send({ message: "Discount is already created" });
        else {
            const newDiscount = await DiscountModel({ 
                discount_percent,
                active: Boolean(active),
                createdAt: formatDate("mm/dd/yyyy")
            });
            await newDiscount.save();
            productExists.discountId = newDiscount._id;
            productExists.save();
            res.send({ message: "Discount has been created" });
        }
    } catch (e) {
        logger(`IN CREATE_DISCOUNT: ${e.message}`, { status: "ERROR", res });
    }
}

async function deleteDicount(req, res) {
    try {
        const { id } = req.params;
        discountExists = await DiscountModel.findByIdAndDelete(id);
        if (!discountExists) res.status(404).send({ message: "Discount not found" });
        else res.send({ message: "Discount has been deleted" });
    } catch (e) {
        logger(`IN DELETE_DISCOUNT: ${e.message}`, { status: "ERROR", res });
    }
} 

async function updateDicount(req, res) {
    try {
        const { id } = req.params;
        const { discount_percent, active } = req.body;
        discountExists = await DiscountModel.findById(id);
        if (!discountExists) res.status(404).send({ message: "Discount not found" });
        else {
            await DiscountModel.findOneAndUpdate({ _id: id }, {
                discount_percent: discount_percent || discountExists.discount_percent,
                active: active || discountExists.active,
                modifiedAt: formatDate("mm/dd/yyyy")
            });
            res.send({ message: "Discount has been updated" });
        }
    } catch (e) {
        logger(`IN UPDATE_DISCOUNT: ${e.message}`, { status: "ERROR", res });
    }
}

module.exports = {
    createDiscount,
    deleteDicount,
    updateDicount
}