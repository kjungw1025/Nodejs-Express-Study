const express = require('express');
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followingIdList = [];
    next();
});

// 라우터의 마지막 미들웨어들을 컨트롤러라고 부름 --> 따로 폴더(controllers)로 분리
router.get('/profile', renderProfile);

router.get('/join', renderJoin);

router.get('/', renderMain);

module.exports = router;
