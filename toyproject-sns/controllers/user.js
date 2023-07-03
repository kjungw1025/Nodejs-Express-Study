const User = require('../models/user');

exports.follow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (user) { // req.user.id가 followerId, req.params.id가 followingId
            await user.addFollowing(parseInt(req.params.id, 10));   // req.params.id는 문자열이므로 -> parseInt
            res.send('success');
        }
        else {
            res.status(404).send('no user');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (user) { // req.user.id가 followerId, req.params.id가 followingId
            await user.removeFollowing(parseInt(req.params.id, 10));   // req.params.id는 문자열이므로 -> parseInt
            res.send('success');
        }
        else {
            res.status(404).send('no user');
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
};