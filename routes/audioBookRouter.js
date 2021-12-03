const { Router } = require("express");

const { createAudioBook, getAudioBook, getAudioBooks, deleteAudioBook, updateAudioBook, toggleFavourite } = require("../controllers/audioBookController");
const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

router.post('/create', checkUser, createAudioBook);
router.post('/', checkUser, getAudioBook);
router.get('/', checkUser, getAudioBooks);
router.delete('/:id', checkUser, deleteAudioBook);
router.put('/:id', checkUser, updateAudioBook);
// router.get('/landing', bookForLandingPage);
// router.post('/filter', checkUser, filterBook);
router.post('/favourite', checkUser, toggleFavourite);

module.exports = {
    audioBookRouter: router
}