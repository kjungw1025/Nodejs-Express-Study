const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');  // uploads 폴더가 있는지 확인
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);    // 이미지의 확장자만 추출
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이미지 이름 + 날짜 + 확장자 ex) 이미지.png --> 이미지20230702.png
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage); // 'img'는 main.html의 forData.append할 때의 첫번째 매개변수와 이름이 같아야함

// Post /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost); // img를 올릴 때는 /post/img, 게시글을 올릴 때는 /post

module.exports = router;