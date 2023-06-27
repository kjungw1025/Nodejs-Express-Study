exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird'}); // res.locals로 선언한 변수들 + 두 번째 인수들도 Front로 넘어감
};

exports.renderJoin = (req, res) => {
    // 서비스를 호출
    res.render('Join', { title: '회원 가입 - NodeBird' });
};

exports.renderMain = (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits: [], // main 화면에서 보여줄 twit들을 미리 배열로 만듦
    });
};

/*
    호출 순서
    라우터 -> 컨트롤러 -> 서비스

    컨트롤러 : 요청과 응답이 무엇인지 암
    서비스 : 요청과 응답 모름
*/