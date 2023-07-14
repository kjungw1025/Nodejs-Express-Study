exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // isAuthenticated : 패스포트 통해서 로그인 했는지
        next();
    }
    else {
        // 403 Forbidden
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // 패스포트 통해서 로그인 안했으면 다음으로 넘어감
        next();
    }
    else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`); // localhost:8001?error=메시지
    }
};