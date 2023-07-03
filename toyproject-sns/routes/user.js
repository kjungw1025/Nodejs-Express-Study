const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow, unfollow } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

// POST /user/:id/unfollow
router.post('/:id/unfollow', isLoggedIn, unfollow);

module.exports = router;