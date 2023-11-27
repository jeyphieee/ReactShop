const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const { createArtist, deleteArtist, getsingleArtist, getAllArtists, updateArtist} = require('../controllers/artistController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/artist/admin/new', isAuthenticatedUser, createArtist);
router.get('/artist/admin/getAll', getAllArtists);
router.get('/artist/admin/:id', getsingleArtist);

module.exports = router;
