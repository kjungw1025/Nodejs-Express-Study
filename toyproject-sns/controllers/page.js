const { User, Post } = require('../models'); 

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird'}); // res.locals로 선언한 변수들 + 두 번째 인수들도 Front로 넘어감
};

exports.renderJoin = (req, res) => {
    // 서비스를 호출
    res.render('Join', { title: '회원 가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};

/*
    호출 순서
    라우터 -> 컨트롤러 -> 서비스

    컨트롤러 : 요청과 응답이 무엇인지 암
    서비스 : 요청과 응답 모름
*/