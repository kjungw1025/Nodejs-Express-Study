const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => { // accessToken, refreshToken은 카카오 api를 호출하는데 사용되나, 여기선 사용하지 않음
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' }, 
            });
            if (exUser) {   //login
                done(null, exUser);
            }
            else {  //join
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email, // 이 구조가 자주 바뀌므로, profile을 console.log를 통해 계속 확인하자
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    }));
};