const { Router } = require("express");

const { ifHasUser, checkUser } = require('../middlewares/authMiddleware')
const { getFile } = require("../controllers/fileController");

const router = Router();

router.get('/:fileName', getFile)
// router.get('/:fileName', checkUser, getFile)

module.exports = {
    fileRouter: router
}
