const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        //raw 쿼리
        //const [result, metadata] = await sequelize.query('SELECT * FROM User');
        //res.render('sequelize', { result });
        const users = await User.findAll();
        res.render('sequelize', { users });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;