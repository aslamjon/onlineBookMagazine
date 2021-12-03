const { Router } = require("express");

const { ifHasUser, checkUser } = require('../middlewares/authMiddleware')
const { getFile } = require("../controllers/fileController");

const router = Router();

router.get('/images/:fileName', getFile)
router.get('/audios/:fileName', getFile)
// router.get('*', (req, res) => res.send({ message: "Page not found" }))

module.exports = {
    fileRouter: router
}
