const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

// process.env.COOKIE_SECRET 없음
dotenv.config(); // process.env
// process.env.COOKIE_SECRET 있음
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })    // 개발시 테이블 잘못 만들었다면 force: true로, 다시 만들어줌 (배포시에는 금지!)
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev')); // 개발할 때는 자세한 dev로, 배포시 combined으로 바꾸는 거 추천
app.use(express.static(path.join(__dirname, 'public'))); // __dirname(app.js가 있는 폴더 toyproject-sns를 가리킴). 그 안의 public 폴더를 가져오라는 의미
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // front에서 img를 가져오기 위함
app.use(express.json());    // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false })); // form양식 요청 허용 (req.body 폼으로부터)
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true, // js에서 접근 못하게 (보안 향상)
        secure: false, // HTTPS로 변경 시 true로 바꾸기
    },
}));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포 모드가 아닐 때 err 넣어줌. 배포 모드면 err 안 넣어줌 --> 배포 시, 에러 로그들은 서비스한테 넘김
    res.status(err.status || 500);
    res.render('error'); // error.html을 nunjucks가 views 폴더에서 찾아서 응답으로 보내줌
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});