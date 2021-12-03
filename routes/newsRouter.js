const { Router } = require("express");

const { createNews, getNews, deleteNews, updateNews } = require("../controllers/newsController");

const router = Router();

router.post('/create', createNews);
router.get('/', getNews);
router.delete('/:id', deleteNews);
router.put('/:id', updateNews);

module.exports = {
    newsRouter: router
}