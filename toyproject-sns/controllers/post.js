const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req, res) => {
    console.log(req.files);
    res.json({ url: `/img/${req.file.filename}`});  // url = main.html의 res.data.url
};

exports.uploadPost = async (req, res, next) => {
    // req.body.content, req.body.url
    try {
        // 예시 : 노드는 재밌다. #nodejs #노드 짱짱
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);   // 정규 표현식을 통해 해시 태그 찾기
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            console.log('result', result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        await Post.destroy({where: {id: req.params.id}});
        res.redirect('/');
    } 
    catch (error) {
        console.error(error);
        next(error);
    }
};

exports.createLike = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.addLiker(req.user.id);
        res.json({ userId: req.user.id });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};

exports.deleteLike = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        await post.removeLiker(req.user.id);
        res.json({ userId: req.user.id });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};