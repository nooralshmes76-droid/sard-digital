const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { text, image } = req.body;

    try {
        const newPost = new Post({
            user: req.user.id, // Assuming auth middleware adds user to req
            text,
            image,
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Like or unlike a post
// @route   PUT /api/posts/like/:id
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if the post has already been liked
        const isLiked = post.likes.some(like => like.toString() === req.user.id);

        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Like
            post.likes.unshift(req.user.id);
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/comment/:id
// @access  Private
exports.addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            user: req.user.id,
            text,
        };

        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user ownership (or admin status)
        if (post.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Post.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
