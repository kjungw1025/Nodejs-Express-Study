const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

// 라우터에서 공통적으로 쓸 수 있는 변수들을 res.locals를 통해 선언
// res.locals는 미들웨어간의 공유되는 데이터
// req.session은 사용자간의 공유되는 데이터 (같은 사용자라면 로그아웃하기 전까지는 req.session에 데이터가 공유됨)
router.use((req, res, next) => {
    res.locals.user = req.user; // 로그인했으면 req.user가 들어있음. 로그인 안했으면 null
    res.locals.followerCount = req.user?.Followers?.length || 0;    // optional chaining
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

// 라우터의 마지막 미들웨어들을 컨트롤러라고 부름 --> 따로 폴더(controllers)로 분리
router.get('/profile', isLoggedIn, renderProfile);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

module.exports = router;
