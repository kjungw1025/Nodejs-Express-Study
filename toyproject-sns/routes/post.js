const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, deletePost, createLike, deleteLike, createComment, readComment, updateComment, deleteComment } = require('../controllers/post');
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

// 게시글
// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage); // 'img'는 main.html의 forData.append할 때의 첫번째 매개변수와 이름이 같아야함

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost); // img를 올릴 때는 /post/img, 게시글을 올릴 때는 /post

// GET /post/:id/delete
router.get('/:id/delete', isLoggedIn, deletePost);


// 좋아요
// POST /post/:id/like
router.post('/:id/like', isLoggedIn, createLike);

// DELETE /delete/:id/like
router.delete('/:id/like', isLoggedIn, deleteLike);


// 댓글
// POST /post/:id/comment
router.post('/:id/comment', isLoggedIn, createComment);

// GET /post/:id/comments
router.get('/:id/comments', readComment);

// UPDATE /post/:id/comment/:commentid
router.patch('/:id/comment/:commentid', isLoggedIn, updateComment);

// DELETE /post/:id/comment/:commentid
router.delete('/:id/comment/:commentid', isLoggedIn, deleteComment);

module.exports = router;