const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./KakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {    // user === exUser
        console.log('serialize');
        done(null, user.id); // user id만 추출
    });
    // {세션 쿠키 : 유저 아이디} --> 메모리에 저장. 나중에는 공유되는 메모리에 저장

    passport.deserializeUser((id, done) => {
        console.log('deserialize');
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
            .then(user => {
                console.log('user', user);
                done(null, user)
            }) // req.user
            .catch(err => done(err));
    });

    local();
    kakao();
}