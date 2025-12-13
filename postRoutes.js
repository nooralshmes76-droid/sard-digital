const express = require('express');
const { check } = require('express-validator');
const { getPosts, createPost, likePost, addComment, deletePost } = require('../controllers/postController');
const auth = require('../middleware/authMiddleware'); // Auth middleware to protect routes
const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getPosts);

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', [auth, [
    check('text', 'Post text is required').not().isEmpty()
]], createPost);

// @route   PUT /api/posts/like/:id
// @desc    Like or unlike a post
// @access  Private
router.put('/like/:id', auth, likePost);

// @route   POST /api/posts/comment/:id
// @desc    Add a comment to a post
// @access  Private
router.post('/comment/:id', [auth, [
    check('text', 'Comment text is required').not().isEmpty()
]], addComment);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, deletePost);

module.exports = router;
