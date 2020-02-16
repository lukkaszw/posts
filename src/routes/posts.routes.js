const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const isAuth = require('../middlewares/auth');

router.get('', postsController.getAll);

router.get('/my', isAuth, postsController.getMyPosts);

router.get('/:id',  postsController.getOne);

router.post('', isAuth, postsController.postOne);

router.put('/:id', isAuth, postsController.putOne)

module.exports = router;

